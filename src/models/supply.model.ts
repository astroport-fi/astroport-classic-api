import { model, Schema } from "mongoose";

const supplySchema: Schema = new Schema(
  {
    timestamp: {
      type: Schema.Types.Date,
      required: false,
      trim: true
    },
    metadata: {
      circulatingSupply: {
        type: Schema.Types.Number,
        required: false,
        trim: true
      },
      priceInUst: {
        type: Schema.Types.Number,
        required: false,
        trim: true
      },
      totalValueLockedUst: {
        type: Schema.Types.Number,
        required: false,
        trim: true
      },
      dayVolumeUst: {
        type: Schema.Types.Number,
        required: false,
        trim: true
      },
    }
  }
);

export const Supply = model('Supply', supplySchema, 'supply_timeseries');
