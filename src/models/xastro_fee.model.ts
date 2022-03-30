import { model, Schema } from "mongoose";

const xAstroFeeSchema: Schema = new Schema(
  {
    block: {
      type: Schema.Types.Number,
      required: true,
      trim: true,
    },
    volume: {
      type: Schema.Types.Number,
      required: true,
      trim: true,
    },
    token: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const xAstroFee = model("XAstroFee", xAstroFeeSchema, "xastro_fee");
