import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Proposal } from "../models/proposal.model";
import { Vote } from "../models/vote.model";

dayjs.extend(utc);

/**
 * Tally vote counts per proposal
 * Save counts on the Proposal table
 */

export async function aggregateVotes(): Promise<void> {
  const proposals = await Proposal.find({ state: "Active" });

  for (const proposal of proposals) {
    const votes = await Vote.find({ proposal_id: proposal.proposal_id });

    // these all represent unique voters
    const totalVoters = new Set<string>();
    const forVoters = new Set<string>();
    const againstVoters = new Set<string>();

    votes.forEach((vote) => {
      if (vote.vote == "for") {
        forVoters.add(vote.voter);
      } else if (vote.vote == "against") {
        againstVoters.add(vote.voter);
      } else {
        console.log("Encountered a non standard vote choice: " + vote.vote);
      }

      totalVoters.add(vote.voter);
    });

    await Proposal.updateOne(
      { proposal_id: proposal.proposal_id },
      {
        $set: {
          votes_for: forVoters.size,
          votes_against: againstVoters.size,
          votes_total: totalVoters.size,
        },
      }
    );
  }
}
