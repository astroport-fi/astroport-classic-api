import { START_BLOCK_HEIGHT } from '../constants';
import { Block } from '../models';

export async function getBlock(chainId: string): Promise<any> {
  const block = await Block.findOne({ chainId });

  if (block == null) {
    const newBlock = new Block({
      chainId,
      dailyHeight: START_BLOCK_HEIGHT,
      hourlyHeight: START_BLOCK_HEIGHT,
      hiveHeight: START_BLOCK_HEIGHT,
    });

    return newBlock.save();
  }
  return block;
}

export async function updateBlock(
  chainId: string,
  object: {
    dailyHeight?: number;
    hourlyHeight?: number;
  }
): Promise<any> {
  const block = await Block.findOneAndUpdate({ chainId }, object);
  return block;
}
