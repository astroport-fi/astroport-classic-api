import { Vote } from "../models/vote.model";

export async function getVotes(proposal_id: number, limit=10, offset=0): Promise<any[]> {
  const votes = await Vote
    .find({ proposal_id: proposal_id})
    .skip(offset)
    .sort({'block': -1})
    .limit(limit)

  return votes;
}

export async function createVote(options: any): Promise<any> {
  try {
    const vote = await Vote.create(options);
    return vote;
  } catch (e) {
    console.log(e);
  }
}
