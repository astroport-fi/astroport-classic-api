import { ReturningLogFinderResult } from "@terra-money/log-finder";
import { createPair, createToken } from "../../services";

export async function createPairIndexer(
  founds: ReturningLogFinderResult<{
    token1: string;
    token2: string;
    contractAddr: string;
    liquidityToken: string;
  }>[],
  timestamp: number
): Promise<void> {
  // createPair
  for (const logFound of founds) {
    const transformed = logFound.transformed;

    if (transformed) {
      await createPair({ ...transformed, createdAt: timestamp });
      await createToken(transformed.token1);
      await createToken(transformed.token2);
    }
  }
}
