import { Schema, model } from "mongoose";

import { PoolProtocolReward as PoolProtocolRewardDocument } from "../types/pool_protocol_reward.type";

const poolProtocolRewardSchema: Schema<PoolProtocolRewardDocument> = new Schema(
  {
    pool: {
      type: Schema.Types.String,
      required: true,
    },
    factory: {
      type: Schema.Types.String,
      required: false,
    },
    proxy: {
      type: Schema.Types.String,
      required: false,
    },
    token: {
      type: Schema.Types.String,
      required: false,
    },
    tokenName: {
      type: Schema.Types.String,
      required: false,
    },
    block: {
      type: Schema.Types.Number,
      required: false,
    },
    volume: {
      type: Schema.Types.Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PoolProtocolReward = model(
  "PoolProtocolReward",
  poolProtocolRewardSchema,
  "pool_protocol_rewards"
);
