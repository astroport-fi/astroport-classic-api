import { Proposal } from "../models/proposal.model";
import { Vote } from "../models/vote.model";
import { aggregateVotesCount } from "./vote.service";

const SECONDS_PER_BLOCK = 6.2;

export async function getProposals(): Promise<any[]> {
  const proposals = await Proposal.find().sort({ proposal_id: -1 });
  return proposals;
}

export async function getProposal(proposal_id: string): Promise<any> {
  const proposal: any = await Proposal.findOne({ proposal_id: proposal_id });

  if (proposal) {
    const votesCount = await aggregateVotesCount(proposal_id);
    if (votesCount) {
      // use aggregated values first, if any return null default back to proposal values
      proposal.votes_for = votesCount?.for?.votes_for || proposal.votes_for;
      proposal.votes_for_power = votesCount?.for?.votes_for_power || proposal.votes_for_power;
      proposal.votes_against = votesCount?.against?.votes_against || proposal.votes_against;
      proposal.votes_against_power =
        votesCount?.against?.votes_against_power || proposal.votes_against_power;
    }
  }

  return proposal;
}

export async function saveProposals(proposals: any[]): Promise<any> {
  const results: any[] = [];

  for (const proposal of proposals) {
    const result = new Proposal();

    result.proposal_id = proposal.proposal_id;
    result.state = proposal.status;
    result.active = new Date(proposal.start_time * 1000);
    result.start_timestamp = new Date(proposal.start_time * 1000);
    const seconds = (proposal.end_block - proposal.start_block) * SECONDS_PER_BLOCK;
    result.end_timestamp = new Date(
      new Date(proposal.start_time * 1000).getTime() + new Date(seconds * 1000).getTime()
    );
    result.start_block = proposal.start_block;
    result.end_block = proposal.end_block;
    result.votes_for_power = proposal.for_power;
    result.votes_against_power = proposal.against_power;
    result.title = proposal.title;
    result.description = proposal.description;
    result.link = proposal.link;
    result.messages = proposal.messages == null ? null : JSON.stringify(proposal.messages);
    result.submitter = proposal.submitter;
    result.submitter_tokens_submitted = proposal.deposit_amount;
    result.total_voting_power = proposal.total_voting_power;

    results.push(result);
  }

  try {
    await Proposal.insertMany(results);
    return results;
  } catch (e) {
    console.log(e);
  }
}

export async function hide_proposals(stale_passed_proposals: any[]): Promise<any> {
  for (const proposal of stale_passed_proposals) {
    await Proposal.updateOne(
      {
        proposal_id: Number(proposal.proposal_id),
      },
      {
        $set: {
          state: "Hidden",
        },
      }
    );
  }
}
