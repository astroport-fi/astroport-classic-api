import { model, Schema } from "mongoose";

/**
 * Latest xastro stats
 */
const xAstroFeeStatSchema: Schema = new Schema(
  {
    block: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _24h_fees_ust: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _24h_apr: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _24h_apy: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _7d_fees_ust: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _7d_apr: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _7d_apy: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _30d_fees_ust: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _30d_apr: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _30d_apy: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    _30d_fees_ust_change: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const xAstroFeeStat = model("XAstroFeeStat", xAstroFeeStatSchema, "xastro_fee_stat");
