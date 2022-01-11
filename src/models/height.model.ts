import { Schema, model } from 'mongoose';

import { Height as HeightDocument } from '../types';

const heightSchema: Schema<HeightDocument> = new Schema(
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

export const Height = model('Height', heightSchema);
