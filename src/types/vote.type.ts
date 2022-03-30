export type Vote = {
  voter: string;
  proposal_id: number;
  vote: string;
  voting_power: number;
  block: number;
  txn: string;
};
