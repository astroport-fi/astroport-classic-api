import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { Proposal } from "../models/proposal.model";
import { getContractStore, getProposals, getTotalVotingPowerAt } from "../lib/terra";
import { getProposals as getSavedProposals, saveProposals } from "../services/proposal.service";
import { proposalListToMap } from "../collector/helpers";
import axios from "axios";
import { generate_post_fields } from "./slackHelpers";
import { update_proposal_timestamps } from "./proposalStateMachine";
import constants from "../environment/constants";
import { aggregateVotesCount } from "../services/vote.service";

dayjs.extend(utc);

/**
 * Check for new governance proposals
 * Update state if changed
 * Push alerts about state changes
 */

const BATCH_SIZE = 100;
const WEBHOOK_URL =
  "https://hooks.slack.com/services/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";

export async function governanceProposalCollect(): Promise<void> {
  console.log("ENABLE_FEE_SWAP_NOTIFICATION: " + constants.ENABLE_FEE_SWAP_NOTIFICATION);
  console.log(constants.ENABLE_FEE_SWAP_NOTIFICATION == true);

  // get proposals from db
  const savedProposals = await getSavedProposals();
  const savedProposalMap = proposalListToMap(savedProposals);

  // get proposals from chain
  let proposals: any[] = [];
  let continue_querying = true;
  let offset = 0;

  while (continue_querying) {
    const proposal_batch = await getProposals(constants.GOVERNANCE_ASSEMBLY, BATCH_SIZE, offset);
    proposals = proposals.concat(proposal_batch);

    continue_querying = proposal_batch.length >= BATCH_SIZE;

    if (offset == 0) {
      offset += 1;
    }
    offset += BATCH_SIZE;
  }

  const new_proposals: any = [];
  const updated_proposals: any = [];

  for (const proposal of proposals) {
    if (savedProposalMap.has(Number(proposal.proposal_id))) {
      // check if existing proposal has changed status, voters
      const saved = savedProposalMap.get(Number(proposal.proposal_id));

      if (saved.state == "Hidden" || saved.state == "Expired") {
        continue;
      }

      //notify comms-assembly channel if 24 hours left and quorum not reached.
      const endTime = new Date(saved.end_timestamp).getTime();
      const now = new Date().getTime();
      const timeLeft = endTime - now;
      const _24Hours_Milliseconds = 86400000;

      if (
        //time left is less than 24 hours.
        timeLeft < _24Hours_Milliseconds &&
        //notification has not been sent yet.
        // making sure this only happens once
        !saved?.notifications?.hit_quorum
      ) {
        // get required quorum
        const res = await getContractStore<{ proposal_required_quorum: string }>(
          constants.GOVERNANCE_ASSEMBLY,
          JSON.parse('{"config": {}}')
        );
        const proposal_required_quorum = Number(res?.proposal_required_quorum ?? "0.1");
        const current_quorum =
          (saved.votes_for_power + saved.votes_against_power) / saved.total_voting_power;

        if (current_quorum < proposal_required_quorum && constants.ENABLE_FEE_SWAP_NOTIFICATION) {
          //send notification
          await notifySlack(
            "*Proposal Quorum has Not been reached for: #" + proposal.proposal_id + "*",
            "https://apeboard.finance/dashboard/" + proposal.submitter,
            proposal.title,
            proposal.description,
            proposal.link
          );

          //update sent notification, this will only happen once if less than 24 hours and quorum has not been reached.
          //next iteration will have notifications.hit_quorum as true, otherwise notification will be sent every minute.
          try {
            await Proposal.updateOne(
              {
                proposal_id: Number(saved.proposal_id),
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

      if (constants.ENABLE_FEE_SWAP_NOTIFICATION) {
        await notifySlack(
          "*New on-chain governance proposal: #" + proposal.proposal_id + "*",
          "https://apeboard.finance/dashboard/" + proposal.submitter,
          proposal.title,
          proposal.description,
          proposal.link
        );
      }

      if (
        proposal.status != saved.state ||
        Number(proposal.for_power) != Number(saved.votes_for_power) ||
        Number(proposal.against_power) != Number(saved.votes_against_power)
      ) {
        update_proposal_timestamps(saved, proposal);
        updated_proposals.push(proposal);
      }
    } else {
      // get total_voting_power
      proposal.total_voting_power = await getTotalVotingPowerAt(
        proposal.start_block - 1,
        proposal.start_time,
        constants.XASTRO_TOKEN,
        constants.BUILDER_UNLOCK,
        constants.VXASTRO_TOKEN
      );

      new_proposals.push(proposal);

      // notify slack for mainnet
      if (constants.ENABLE_FEE_SWAP_NOTIFICATION) {
        await notifySlack(
          "*New on-chain governance proposal: #" + proposal.proposal_id + "*",
          "https://apeboard.finance/dashboard/" + proposal.submitter,
          proposal.title,
          proposal.description,
          proposal.link
        );
      }
    }
  }

  // save new proposals
  await saveProposals(new_proposals);

  // save updated proposal states, dates, votes
  for (const updated of updated_proposals) {
    const votesCount = await aggregateVotesCount(updated.proposal_id);

    await Proposal.updateOne(
      {
        proposal_id: Number(updated.proposal_id),
      },
      {
        $set: {
          state: updated.status,
          passed: updated.passed,
          executed: updated.executed,
          rejected: updated.rejected,
          expired: updated.expired,
          votes_for_power: updated.for_power,
          votes_against_power: updated.against_power,
          //Aggregated Values
          votes_against_counted: votesCount?.against?.votes_against,
          votes_against_power_counted: votesCount?.against?.votes_against_power,
          votes_for_counted: votesCount?.for?.votes_for,
          votes_for_power_counted: votesCount?.for?.votes_for_power,
        },
      }
    );
  }
}

async function notifySlack(
  intro: string,
  wallet_link: string,
  title: string,
  description: string,
  link: string
) {
  const post_fields = generate_post_fields(intro, wallet_link, title, description, link);

  const config = {
    headers: {
      "Content-Type": "application/json",
      charset: "utf-8",
    },
  };

  await axios.post(WEBHOOK_URL, post_fields, config);
}
