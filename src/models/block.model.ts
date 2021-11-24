import { Schema, model } from 'mongoose';

import { Block as BlockDocument } from '../types';

const blockSchema: Schema<BlockDocument> = new Schema(
  {
    chainId: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hiveHeight: {
      type: Schema.Types.Number,
      required: true,
    },
    dailyHeight: {
      type: Schema.Types.Number,
      required: true,
    },
    hourlyHeight: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Block = model('Block', blockSchema);
