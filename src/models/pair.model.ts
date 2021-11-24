import { Schema, model } from 'mongoose';

import { Pair as PairDocument } from '../types/pair.type';

const pairSchema: Schema<PairDocument> = new Schema(
  {
    contractAddress: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

export const Pair = model('Pair', pairSchema);
