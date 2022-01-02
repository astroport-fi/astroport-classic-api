import { Schema, model } from 'mongoose';
import { Supply as SupplyDocument } from '../types/supply.type';

const supplySchema: Schema<SupplyDocument> = new Schema(
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
