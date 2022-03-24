import { Schema, model } from 'mongoose';

import { Proposal as ProposalDocument } from '../types';

const proposalSchema: Schema<ProposalDocument> = new Schema(
  {
    proposal_id: {
      type: Schema.Types.Number,
      required: true,
      unique: true
    },
    state: {
      type: Schema.Types.String,
      required: false,
    },
    active: {
      type: Schema.Types.Date,
      required: false,
    },
    passed: {
      type: Schema.Types.Date,
      required: false,
    },
    executed: {
      type: Schema.Types.Date,
      required: false,
    },
    rejected: {
      type: Schema.Types.Date,
      required: false,
    },
    expired: {
      type: Schema.Types.Date,
      required: false,
    },
    start_timestamp: {
      type: Schema.Types.Date,
      required: false,
    },
    end_timestamp: {
      type: Schema.Types.Date,
      required: false,
    },
    start_block: {
      type: Schema.Types.Number,
      required: false,
    },
    end_block: {
      type: Schema.Types.Number,
      required: false,
    },
    votes_for: {
      type: Schema.Types.Number,
      required: false,
    },
    votes_against: {
      type: Schema.Types.Number,
      required: false,
    },
    votes_for_power: {
      type: Schema.Types.Number,
      required: false,
    },
    votes_against_power: {
      type: Schema.Types.Number,
      required: false,
    },
    total_voting_power: {
      type: Schema.Types.Number,
      required: false,
    },
    title: {
      type: Schema.Types.String,
      required: false,
    },
    description: {
      type: Schema.Types.String,
      required: false,
    },
    link: {
      type: Schema.Types.String,
      required: false,
    },
    messages: {
      type: Schema.Types.String,
      required: false,
    },
    submitter: {
      type: Schema.Types.String,
      required: false,
    },
    submitter_tokens_submitted: {
      type: Schema.Types.Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Proposal = model('Proposal', proposalSchema, "proposal");
