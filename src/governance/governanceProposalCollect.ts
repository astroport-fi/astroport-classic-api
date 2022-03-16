import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { GOVERNANCE_ASSEMBLY } from "../constants";
import { Proposal as ProposalType } from "../types";
import { Proposal } from "../models/proposal.model";
import { getProposals } from "../lib/terra";
import { getProposals as getSavedProposals, saveProposals } from "../services/proposal.service";
import { proposalListToMap } from "../collector/helpers";
import axios from "axios";
import { generate_post_fields } from "./slackHelpers";

dayjs.extend(utc);

/**
 * Check for new governance proposals
 * Update state if changed
 * Push alerts about state changes
 */

const BATCH_SIZE = 100
const WEBHOOK_URL = "https://hooks.slack.com/services/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"

export async function governanceProposalCollect(): Promise<void> {

    // get proposals from db
    const savedProposals = await getSavedProposals()
    const savedProposalMap = proposalListToMap(savedProposals)

    // get proposals from chain
    let proposals: ProposalType[] = []
    let continue_querying = true
    let offset = 0

    while(continue_querying) {
        const proposal_batch = await getProposals(GOVERNANCE_ASSEMBLY, BATCH_SIZE, offset)
        proposals = proposals.concat(proposal_batch)

        continue_querying = proposal_batch.length >= BATCH_SIZE

        if(offset == 0) {
            offset += 1
        }
        offset += BATCH_SIZE
    }

    const new_proposals: ProposalType[] = []
    const updated_proposals: ProposalType[] = []

    for(const proposal of proposals) {
        if(savedProposalMap.has(Number(proposal.proposal_id))) {
            // check if existing proposal has changed status, voters
            console.log()


        } else {
            new_proposals.push(proposal)
            await notifySlack(
              '*New on-chain governance proposal: #' + proposal.proposal_id + "*",
              'https://apeboard.finance/dashboard/' + proposal.submitter,
              proposal.title,
              proposal.description,
              proposal.link)
        }
    }

    // save new proposals
    await saveProposals(new_proposals)

    // save updated proposal states, dates, votes
    for(const updated of updated_proposals) {
        await Proposal.updateOne(
          {
              proposal_id: updated.proposal_id
          },
          {
              $set: {
                  state: updated.state,
                  passed: updated.passed,
                  executed: updated.executed,
                  rejected: updated.rejected,
                  expired: updated.expired,
                  votes_for: updated.votes_for,
                  votes_for_power: updated.votes_for_power,
                  votes_against: updated.votes_against,
                  votes_against_power: updated.votes_against_power,
              }
          },
          { upsert: true }
        )
    }
}

async function notifySlack(intro: string, wallet_link: string, title: string, description: string, link: string) {
    const post_fields = generate_post_fields(intro, wallet_link, title, description, link)

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8'
        }
    }

    await axios.post(WEBHOOK_URL, post_fields, config)
}