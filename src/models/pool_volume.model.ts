import { Schema, model } from "mongoose";
import { PoolVolume as PoolVolumeDocument } from "../types/pool_volume.type";

const poolVolumeSchema: Schema<PoolVolumeDocument> = new Schema({
  poolAddress: {
    type: Schema.Types.String,
    required: false,
    trim: true,
  },
  block: {
    type: Schema.Types.Number,
    required: false,
    trim: true,
  },
  volume: {
    type: Schema.Types.Number,
    required: false,
    trim: true,
  },
});

export const PoolVolume = model("PoolVolume", poolVolumeSchema, "pool_volume");
