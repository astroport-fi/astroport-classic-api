import { Schema, model } from 'mongoose';

import { Token as TokenDocument } from '../types/token.type';

const tokenSchema: Schema<TokenDocument> = new Schema(
  {
    tokenAddr: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    decimals: {
      type: Schema.Types.Number,
      required: true,
      trim: true,
    },
    icon: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    symbol: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Token = model('Token', tokenSchema);
