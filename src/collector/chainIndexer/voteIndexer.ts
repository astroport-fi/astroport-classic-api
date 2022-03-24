import { ReturningLogFinderResult } from "@terra-money/log-finder";
import { createVote } from "../../services/vote.service";

export async function voteIndexer(
  founds: ReturningLogFinderResult<{
    proposal_id: number;
    voter: string;
    vote: string;
    voting_power: number;
  }>[],
  timestamp: number,
  height: number,
  txnHash: string
): Promise<void> {
  for (const logFound of founds) {
    const transformed = logFound.transformed;

    if (transformed) {
      await createVote({ ...transformed, createdAt: timestamp, block: height, txn: txnHash });
    }
  }
}
