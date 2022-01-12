import { Airdrop } from '../models';

export async function getAirdrops(address: string): Promise<any[]> {
  const airdrops = await Airdrop.find({ address });

  return airdrops;
}

export async function updateAirdrop(address: string): Promise<any> {
  const airdrop = await Airdrop.findOneAndUpdate(
    { address },
    { claimed: true }
  );
  return airdrop;
}
