import dayjs from "dayjs";
import constants from "../environment/constants";
import { Height } from "../models";

export async function getLastHeight(chainId: string): Promise<any> {
  const heights = await Height.find({ chainId }).sort({ value: -1 }).limit(1);

  if (heights.length == 0) {
    const newHeight = new Height({
      chainId,
      value: constants.START_BLOCK_HEIGHT,
    });

    return newHeight.save();
  }

  return heights[0];
}

export async function getHeight({
  chainId,
  value,
}: {
  chainId: string;
  value: number;
}): Promise<any> {
  const height = await Height.find({
    chainId,
    value: { $gte: value - 1000, $lt: value + 1000 },
  });

  return height[0];
}

export async function getHeightByDate(chainId: string, date: string): Promise<any> {
  const before = dayjs(date).utc().subtract(10, "m").toISOString();
  const after = dayjs(date).utc().add(10, "m").toISOString();

  const height = await Height.find({
    chainId,
    createdAt: { $gte: before, $lt: after },
  });

  return height[0];
}

export async function createHeight({ chainId, value, createdAt }: any): Promise<any> {
  const height = await Height.create({
    chainId,
    value,
    createdAt,
  });
  return height;
}
