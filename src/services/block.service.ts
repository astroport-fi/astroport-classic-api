import constants from "../environment/constants";
import { Block } from "../models";

export async function getBlock(chainId: string): Promise<any> {
  const block = await Block.findOne({ chainId: chainId });

  if (block == null) {
    const newBlock = new Block({
      chainId,
      dailyHeight: constants.START_BLOCK_HEIGHT,
      hiveHeight: constants.START_BLOCK_HEIGHT,
    });

    return newBlock.save();
  }
  return block;
}

// for api
export async function getBlockResponse(): Promise<any> {
  const block = await Block.findOne({ chainId: constants.TERRA_CHAIN_ID });
  return {
    height: block?.hiveHeight,
    updatedAt: block?.updatedAt,
  };
}

export async function updateBlock(
  chainId: string,
  object: {
    dailyHeight?: number;
    hiveHeight?: number;
  }
): Promise<any> {
  const block = await Block.findOneAndUpdate({ chainId: chainId }, object);
  return block;
}
