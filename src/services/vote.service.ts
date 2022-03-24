import { Vote } from "../models/vote.model";

export async function getVotes(proposal_id: number, choice: string, limit=10, offset=0): Promise<any[]> {

  if(choice != "for" && choice != "against") {
    return []
  }

  const query = {
    proposal_id: proposal_id
  }
  if(choice != null) {
    (query as any).vote = choice
  }


  const votes = await Vote
    .find(query)
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
