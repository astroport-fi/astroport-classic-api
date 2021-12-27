import { Airdrop } from '../models';

export async function getAirdrop(address: string): Promise<any> {
  const airdrop = await Airdrop.findOne({ address });

  return airdrop;
}

export async function updateAirdrop(address: string): Promise<any> {
  const airdrop = await Airdrop.findOneAndUpdate(
    { address },
    { claimed: true }
  );
  return airdrop;
}
