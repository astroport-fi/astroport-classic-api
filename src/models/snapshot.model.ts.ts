import { Schema, model } from "mongoose";

const snapshotSchema: Schema = new Schema(
  {
    block: {
      type: Schema.Types.Number,
      required: false
    },
    pool: {
      type: Schema.Types.Mixed,
      required: false
    },
    stat: {
      type: Schema.Types.Mixed,
      required: false
    },
    price: {
      type: Schema.Types.Mixed,
      required: false
    },
    xastro: {
      type: Schema.Types.Mixed,
      required: false
    },
    supply: {
      type: Schema.Types.Mixed,
      required: false
    }
  },
  {
    timestamps: true,
  }
);

export const Snapshot = model("Snapshot", snapshotSchema, "snapshot");
