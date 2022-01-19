import { Schema, model } from 'mongoose';

import { Price as PriceDocument } from '../types/price.type';

const priceSchema: Schema<PriceDocument> = new Schema(
  {
    pair: {
      type: Schema.Types.ObjectId,
      ref: 'Pair',
    },
    pair_address: {
      type: Schema.Types.String,
      required: true
    },
    token1: {
      type: Schema.Types.Number,
      required: true,
    },
    token2: {
      type: Schema.Types.Number,
      required: true,
    },
    updated_on_block: {
      type: Schema.Types.Number,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

export const Price = model('Price', priceSchema);
