import { captureFunctionException } from "../lib/error-handlers";
import { Vote } from "../models/vote.model";
import { AggregatedVotesResult, AggregatedVotes } from "../types/vote.type";

export async function getVotes(
  proposal_id: number,
  choice = null,
  limit = 10,
  offset = 0
): Promise<any[]> {
  const query = {
    proposal_id: proposal_id,
  };
  if (choice != null) {
    (query as any).vote = choice;
  }

  const votes = await Vote.find(query).skip(offset).sort({ voting_power: -1 }).limit(limit);

  return votes;
}

export async function createVote(options: any): Promise<any> {
  try {
    const vote = await Vote.create(options);
    return vote;
  } catch (e) {
    await captureFunctionException(e, {
      name: "vote.service.ts/createVote",
    });
  }
}

export const aggregateVotesCount = async (id: string): Promise<AggregatedVotes | null> => {
  try {
    const parsedId = parseInt(id);
    const votes: AggregatedVotesResult = await Vote.aggregate([
      {
        $facet: {
          for: [
            { $match: { proposal_id: parsedId, vote: "for" } },
            {
              $group: {
                _id: "$proposal_id",
                votes_for: { $sum: 1 },
                votes_for_power: { $sum: "$voting_power" },
              },
            },
          ],
          against: [
            {
              $match: {
                proposal_id: parsedId,
                vote: "against",
              },
            },
            {
              $group: {
                _id: "$proposal_id",
                votes_against: { $sum: 1 },
                votes_against_power: { $sum: "$voting_power" },
              },
            },
          ],
        },
      },
    ]);

    const result = votes[0];
    return {
      for: result?.for[0],
      against: result?.against[0],
    };
  } catch (e) {
    console.log("Error aggregating votes", e);
    return null;
  }
};
