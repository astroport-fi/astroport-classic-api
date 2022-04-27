export type Vote = {
  voter: string;
  proposal_id: number;
  vote: string;
  voting_power: number;
  block: number;
  txn: string;
};

export type AggregatedVotesResult = {
  for: For[];
  against: Against[];
}[];

export interface AggregatedVotes {
  for: For;
  against: Against;
}

export interface For {
  _id: number;
  votes_for: number;
  votes_for_power: number;
}

export interface Against {
  _id: number;
  votes_against: number;
  votes_against_power: number;
}
