import { ReturningLogFinderResult } from "@terra-money/log-finder";
import { getPairMessages } from "../../lib/terra";
import { createPair, createToken } from "../../services";

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

    const messages = await getPairMessages(txHash);
    const pair_type = messages.find(() => true)?.execute_msg?.create_pair?.pair_type || {};
    const type = Object.keys(pair_type).find(() => true);

    if (transformed) {
      await createPair({ ...transformed, createdAt: timestamp, type });
      await createToken(transformed.token1);
      await createToken(transformed.token2);
    }
  }
}
