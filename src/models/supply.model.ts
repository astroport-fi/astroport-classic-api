import { Schema, model } from 'mongoose';
import { Supply as SupplyDocument } from '../types/supply.type';

const supplySchema = new Schema({
  timestamp: Date,
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
});

export const Supply = model('Supply', supplySchema, 'supply_timeseries');
