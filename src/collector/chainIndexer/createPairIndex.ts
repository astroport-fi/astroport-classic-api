import { ReturningLogFinderResult } from "@terra-money/log-finder";
import constants from "../../environment/constants";
import { getIBCDenom, getPairMessages, getTokenInfo } from "../../lib/terra";
import { Token } from "../../models";
import { isIBCToken } from "../../modules/terra";
import { createPair, createToken } from "../../services";
import { PairIndexedResult } from "../../types";
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
      name: constants.IBC_DENOM_MAP.get(denom)?.name,
      symbol: constants.IBC_DENOM_MAP.get(denom)?.symbol,
    };
  }

  if (isIBCToken(address2)) {
    const denom = await getIBCDenom(address2);
    token2 = {
      name: constants.IBC_DENOM_MAP.get(denom)?.name,
      symbol: constants.IBC_DENOM_MAP.get(denom)?.symbol,
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
): Promise<PairIndexedResult[]> {
  const indexed: PairIndexedResult[] = [];
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

      const createdTokens: any[] = [];
      const createdPair = await createPair({
        ...transformed,
        createdAt: timestamp,
        type,
        description,
      });

      let createdToken = await createToken(token1Info as TokenInfo);
      if (createdToken) {
        createdTokens.push(createdToken);
      }

      createdToken = await createToken(token2Info as TokenInfo);
      if (createdToken) {
        createdTokens.push(createdToken);
      }

      // Only add if the pair was created or either of the tokens
      if (createdPair || createdTokens.length > 0) {
        indexed.push({
          pair: createdPair,
          tokens: createdTokens,
        });
      }
    }
  }
  return indexed;
}
