import { Schema, model } from 'mongoose';
import { Height } from "../../types";


const testnetHeightSchema: Schema<Height> = new Schema(
  {
    chainId: {
      type: Schema.Types.String,
      required: true,
    },
    value: {
      type: Schema.Types.Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TestnetHeight = model('TestnetHeight', testnetHeightSchema, "testnetHeight");
