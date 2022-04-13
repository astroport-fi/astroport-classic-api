import { Schema, model } from "mongoose";

import { Pair as PairDocument } from "../types/pair.type";

const pairSchema: Schema<PairDocument> = new Schema(
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
      default: "xyk",
    },
    deregistered: {
      type: Schema.Types.Boolean,
      trim: true,
      default: false,
    },
    description: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Pair = model("Pair", pairSchema);
