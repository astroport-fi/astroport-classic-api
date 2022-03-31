import { model, Schema } from "mongoose";

const poolVolume24hSchema: Schema = new Schema(
  {
      pool_address: {
        type: Schema.Types.String,
        required: false,
        trim: true
      },
      block: {
        type: Schema.Types.Number,
        required: false,
        trim: true
      },
      _24h_volume: {
        type: Schema.Types.Number,
        required: false,
        trim: true
      },
  }
);

export const PoolVolume24h = model('PoolVolume24h', poolVolume24hSchema, 'pool_volume_24h');
