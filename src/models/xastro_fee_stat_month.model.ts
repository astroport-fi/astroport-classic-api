import { Schema, model } from "mongoose";

const xAstroFeeStatMonthSchema: Schema = new Schema(
  {
    block: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    month: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    _fees_ust: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _fees_ust_change: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const xAstroFeeStatMonth = model(
  "XAstroFeeStatMonth",
  xAstroFeeStatMonthSchema,
  "xastro_fee_stat_month"
);
