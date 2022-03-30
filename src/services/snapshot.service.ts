import { Snapshot } from "../models/snapshot.model.ts";

export async function getSnapshots(limit = 10, offset = 0): Promise<any> {
  if(limit > 10) {
    limit = 10
  }
  const result = await Snapshot.find().skip(offset).sort({ block: -1 }).limit(limit)

  if (!result) {
    return Promise.reject();
  }

  return result
}
