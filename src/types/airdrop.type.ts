export type Airdrop = {
  amount: number;
  claimed: boolean;
  address: string;
  merkle_proof: string[];
  index: number;
  airdrop_series: number;
};
