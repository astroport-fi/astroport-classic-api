import { Schema, model } from 'mongoose';

import { Pair as PairDocument } from '../types/pair.type';

const supplySchema: Schema<PairDocument> = new Schema(
  {
    contractAddr: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    liquidityToken: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    token1: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    token2: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      default: 'xyk',
    },
  },
  {
    timestamps: true,
  }
);

export const Supply = model('Supply', supplySchema);
