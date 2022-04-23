import { TestnetHeight } from "./testnetHeight.model";
import { TestnetBlock } from "./testnetBlock.model";
import { Block } from "../../models";

export async function createHeight(chainId: string, value: number, createdAt: any): Promise<any> {
  const height = await TestnetHeight.create({
    chainId,
    value,
    createdAt,
  });
  return height;
}

export async function getLastHeight(chainId: string): Promise<any> {
  const heights = await TestnetHeight.find({ chainId }).sort({ value: -1 }).limit(1);

  if (heights.length == 0) {
    const newHeight = new TestnetHeight({
      chainId,
      value: 8374059,
    });

    return newHeight.save();
  }

  return heights[0];
}

export async function getBlock(chainId: string): Promise<any> {
  const block = await TestnetBlock.findOne({ chainId: chainId });

  if (block == null) {
    const newBlock = new TestnetBlock({
      chainId,
      dailyHeight: 8374059,
      hiveHeight: 8374059,
    });

    return newBlock.save();
  }
  return block;
}

export async function updateBlock(
  chainId: string,
  object: {
    dailyHeight?: number;
    hiveHeight?: number;
  }
): Promise<any> {
  const block = await TestnetBlock.findOneAndUpdate({ chainId: chainId }, object);
  return block;
}
