import { Schema, model } from "mongoose";

import { PriceV2 as PriceDocument } from "../types/priceV2.type";

const priceV2Schema: Schema<PriceDocument> = new Schema(
  {
    token_address: {
      type: Schema.Types.String,
      required: true,
    },
    price_usd: {
      type: Schema.Types.Number,
      required: false,
    },
    price_ust: {
      type: Schema.Types.Number,
      required: false,
    },
    ust_usd: {
      type: Schema.Types.Number,
      required: false,
    },
    is_external: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    symbol: {
      type: Schema.Types.String,
      required: false,
    },
    source: {
      feed: {
        type: Schema.Types.String,
        required: false,
      },
      category_id: {
        type: Schema.Types.String,
        required: false,
      },
      name: {
        type: Schema.Types.String,
        required: false,
      },
    },
    block_last_updated: {
      type: Schema.Types.Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PriceV2 = model("PriceV2", priceV2Schema, "prices_v2");
