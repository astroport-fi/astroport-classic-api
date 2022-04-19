import { ReturningLogFinderResult } from "@terra-money/log-finder";
import { IBC_DENOM_MAP } from "../../constants";
import { getIBCDenom, getPairMessages, getTokenInfo } from "../../lib/terra";
import { Token } from "../../models";
import { isIBCToken } from "../../modules/terra";
import { createPair, createToken } from "../../services";
import { TokenInfo } from "../../types/hive.type";

// description for full text search
export const generateDescription = async (
  token1: any,
  token2: any,
  address1: string,
  address2: string
): Promise<string> => {
  // check for ibcToken
  if (isIBCToken(address1)) {
    const denom = await getIBCDenom(address1);
    token1 = {
      name: IBC_DENOM_MAP.get(denom)?.name,
      symbol: IBC_DENOM_MAP.get(denom)?.symbol,
    };
  }

  if (isIBCToken(address2)) {
    const denom = await getIBCDenom(address2);
    token1 = {
      name: IBC_DENOM_MAP.get(denom)?.name,
      symbol: IBC_DENOM_MAP.get(denom)?.symbol,
    };
  }

  // check in db for native assets.
  if (!token1) {
    token1 = await Token.findOne({ tokenAddr: address1 });
  }
  if (!token2) {
    token2 = await Token.findOne({ tokenAddr: address2 });
  }

  const description = `${token1?.name || ""} - ${token2?.name || ""} ,  ${token1?.symbol || ""} - ${
    token2?.symbol || ""
  }`;

  return `${description} , ${description.toLowerCase()}`;
};

export async function createPairIndexer(
  founds: ReturningLogFinderResult<{
    token1: string;
    token2: string;
    contractAddr: string;
    liquidityToken: string;
  }>[],
  timestamp: number,
  txHash: string
): Promise<void> {
  // createPair
  for (const logFound of founds) {
    const transformed = logFound.transformed;

    if (transformed) {
      const messages = await getPairMessages(txHash);
      const pair_type = messages?.create_pair?.pair_type || {};
      const type = Object.keys(pair_type).find(() => true);

      const token1Info = await getTokenInfo(transformed.token1);
      const token2Info = await getTokenInfo(transformed.token2);
      const description = await generateDescription(
        token1Info as TokenInfo,
        token2Info as TokenInfo,
        transformed.token1,
        transformed.token2
      );

      await createPair({ ...transformed, createdAt: timestamp, type, description });
      await createToken(token1Info as TokenInfo);
      await createToken(token2Info as TokenInfo);
    }
  }
}
