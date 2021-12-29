import { Supply } from '../models';

export async function getPairs(): Promise<any[]> {
  const pairs = await Pair.find();
  return pairs;
}

export async function getPair(contractAddress: string): Promise<any> {
  const pair = await Pair.findOne({ contractAddress });
  return pair;
}

export async function createPair(options: any): Promise<any> {
  try {
    const pair = await Pair.create(options);
    return pair;
  } catch (e) {
    console.log(e);
  }
}
