import { ReturningLogFinderResult } from "@terra-money/log-finder";
import { getPairMessages, getTokenInfo } from "../../lib/terra";
import { createPair, createToken } from "../../services";
import { TokenInfo } from "../../types/hive.type";

export const generateDescription = (token1: TokenInfo, token2: TokenInfo): string => {
  return `${token1?.name} - ${token2?.name} , ${token1?.symbol} - ${token2?.symbol}`;
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
      const description = generateDescription(token1Info as TokenInfo, token2Info as TokenInfo);

      await createPair({ ...transformed, createdAt: timestamp, type, description });
      await createToken(token1Info as TokenInfo);
      await createToken(token2Info as TokenInfo);
    }
  }
}
