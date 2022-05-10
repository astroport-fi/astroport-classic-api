import { captureFunctionException } from "../lib/error-handlers";
import { getContractStore } from "../lib/terra";
import constants from "../environment/constants";
import { Proposal } from "../models/proposal.model";
import { Proposal as ProposalDocument } from "../types";
import { notifySlack } from "../governance/slackHelpers";

const SECONDS_PER_BLOCK = 6.5;

export async function getProposals(): Promise<any[]> {
  const proposals = await Proposal.find().sort({ proposal_id: -1 });
  return proposals;
}

export async function getProposal(proposal_id: string): Promise<ProposalDocument | null> {
  const proposal = await Proposal.findOne<ProposalDocument>({ proposal_id: proposal_id });
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
    await captureFunctionException(e, {
      name: "proposal.service.ts/saveProposals",
    });
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

/**
 * notify comms-assembly channel if 24 hours left and quorum not reached.
 * @param proposal the proposal to check
 */
export const notify_slack_no_quorum = async (proposal: ProposalDocument): Promise<void> => {
  const endTime = new Date(proposal.end_timestamp).getTime();
  const now = new Date().getTime();
  const timeLeft = endTime - now;
  const _24Hours_Milliseconds = 86400000;

  if (
    //time left is less than 24 hours.
    timeLeft < _24Hours_Milliseconds &&
    //notification has not been sent yet.
    // making sure this only happens once
    !proposal?.notifications?.hit_quorum
  ) {
    // get required quorum
    const res = await getContractStore<{ proposal_required_quorum: string }>(
      constants.GOVERNANCE_ASSEMBLY,
      JSON.parse('{"config": {}}')
    );
    const proposal_required_quorum = Number(res?.proposal_required_quorum ?? "0.1");
    const current_quorum =
      (proposal.votes_for_power + proposal.votes_against_power) / proposal.total_voting_power;

    if (current_quorum < proposal_required_quorum && constants.ENABLE_FEE_SWAP_NOTIFICATION) {
      //send notification
      await notifySlack({
        intro:
          "*24 Hours Left, Quorum has Not been reached for proposal: #" +
          proposal.proposal_id +
          "*",
        title: proposal.title,
        description: proposal.description,
        link: proposal.link,
      });

      //update sent notification, this will only happen once if less than 24 hours and quorum has not been reached.
      //next iteration will have notifications.hit_quorum as true, otherwise notification will be sent every minute.
      try {
        await Proposal.updateOne(
          {
            proposal_id: Number(proposal.proposal_id),
          },
          {
            $set: {
              notifications: { hit_quorum: true },
            },
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  }
};
