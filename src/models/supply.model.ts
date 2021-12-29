import { Schema, model } from 'mongoose';
import { Supply as SupplyDocument } from '../types/supply.type';

const supplySchema: Schema<SupplyDocument> = new Schema(
  {
    circulatingSupply: {
      type: Schema.Types.Number,
      required: true,
      trim: true, },
    dayVolumeUsd: {
      type: Schema.Types.Number,
      required: true,
      trim: true, },
    priceInUst: {
      type: Schema.Types.Number,
      required: true,
      trim: true, },
    totalValueLockedUST: {
      type: Schema.Types.Number,
      required: true,
      trim: true, }});

export const Supply = model('Supply', supplySchema);
