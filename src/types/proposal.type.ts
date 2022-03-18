export type Proposal = {
  proposal_id: number;
  state: string;
  active: Date;
  passed: Date;
  executed: Date;
  rejected: Date;
  expired: Date;
  start_timestamp: Date;
  end_timestamp: Date;
  start_block: number;
  end_block: number;
  votes_for_power: number;
  votes_against_power: number;
  total_voting_power: number;
  title: string;
  description: string;
  link: string;
  messages: string|null;
  submitter: string;
  submitter_tokens_submitted: number;
};