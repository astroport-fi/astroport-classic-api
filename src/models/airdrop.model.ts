import { Schema, model } from 'mongoose';

import { Airdrop as AirdropDocument } from '../types/airdrop.type';

const airdropSchema: Schema<AirdropDocument> = new Schema(
  {
    amount: {
      type: Schema.Types.Number,
      required: true,
    },
    address: {
      type: Schema.Types.String,
      required: true,
    },
    claimed: {
      type: Schema.Types.Boolean,
      required: false,
      default: false,
    },
    proofs: {
      type: [Schema.Types.String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Airdrop = model('Airdrop', airdropSchema);
