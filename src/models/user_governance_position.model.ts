import { Schema, model } from "mongoose";
import { UserGovernancePosition as UserGovernancePositionDocument } from "../types/user_governance_position.type";

const userGovernancePositionSchema: Schema<UserGovernancePositionDocument> = new Schema(
  {
    address: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    xastroBalance: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    vxastroBalance: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
    vxLockEndTimestamp: {
      type: Schema.Types.Number,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserGovernancePosition = model(
  "UserGovernancePosition",
  userGovernancePositionSchema,
  "user_governance_position"
);
