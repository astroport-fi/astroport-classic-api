import { ReturningLogFinderResult } from "@terra-money/log-finder";
import { createVote } from "../../services/vote.service";
import { Vote } from "../../types/vote.type";

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
): Promise<Vote[]> {
  const votesIndexed: Vote[] = [];
  for (const logFound of founds) {
    const transformed = logFound.transformed;

    if (transformed) {
      const createdVote = await createVote({
        ...transformed,
        createdAt: timestamp,
        block: height,
        txn: txnHash,
      });
      if (createdVote) {
        votesIndexed.push(createdVote);
      }
    }
  }
  return votesIndexed;
}
