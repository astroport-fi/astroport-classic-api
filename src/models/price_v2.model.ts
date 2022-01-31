import { Schema, model } from 'mongoose';

import { PriceV2 as PriceDocument } from "../types/priceV2.type";

const priceV2Schema: Schema<PriceDocument> = new Schema(
  {
    tokenAddress: {
      type: Schema.Types.String,
      required: false
    },
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    updatedOnBlock: {
      type: Schema.Types.Number,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

export const PriceV2 = model('PriceV2', priceV2Schema, 'prices_v2');
