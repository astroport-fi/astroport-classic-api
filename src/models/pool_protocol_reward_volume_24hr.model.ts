import { model, Schema } from "mongoose";

const poolProtocolRewardVolume24hSchema: Schema = new Schema(
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
      volume: {
        type: Schema.Types.Number,
        required: false,
        trim: true
      },
  }
);

export const PoolProtocolRewardVolume24h = model('PoolProtocolRewardVolume24h', poolProtocolRewardVolume24hSchema, 'pool_protocol_rewards_24h');
