import { Supply } from "../models/supply.model";
import { Supply as SupplyType } from "../types/supply.type";
import { Snapshot } from "../models/snapshot.model.ts";

export async function getSnapshots(limit = 20, offset = 0): Promise<any> {
  if(limit > 20) {
    limit = 20
  }
  const result = await Snapshot.find().skip(offset).sort({ block: -1 }).limit(limit)

  if (!result) {
    return Promise.reject();
  }

  return result
}
