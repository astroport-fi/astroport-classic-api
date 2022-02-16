import { model, Schema } from "mongoose";

const poolProtocolRewardVolume7dSchema: Schema = new Schema(
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

export const PoolProtocolRewardVolume7d = model('PoolProtocolRewardVolume7d', poolProtocolRewardVolume7dSchema, 'pool_protocol_rewards_7d');
