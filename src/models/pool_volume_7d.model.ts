import { Schema, model } from "mongoose";

const poolVolume7dSchema: Schema = new Schema({
  pool_address: {
    type: Schema.Types.String,
    required: false,
    trim: true,
  },
  block: {
    type: Schema.Types.Number,
    required: false,
    trim: true,
  },
  _7d_volume: {
    type: Schema.Types.Number,
    required: false,
    trim: true,
  },
});

export const PoolVolume7d = model("PoolVolume7d", poolVolume7dSchema, "pool_volume_7d");
