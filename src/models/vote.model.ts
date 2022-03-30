import { Schema, model } from "mongoose";
import { Vote as VoteDocument } from "../types/vote.type";

const voteSchema: Schema<VoteDocument> = new Schema(
  {
    voter: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    proposal_id: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    vote: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
    voting_power: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    block: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    txn: {
      type: Schema.Types.String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Vote = model("Vote", voteSchema);
