import { expect } from "chai";
import { Vote } from "../../src/models/vote.model";
import { getPools } from "../../src/services";
import { getProposal } from "../../src/services/proposal.service";
import { PoolSortFields } from "../../src/types/pool.type";

describe("services/proposal.service", function () {
  describe("getProposal", function () {
    let proposal: any;
    const proposalId = "11";
    const proposalIdNum = 11;

    before(async () => {
      proposal = await getProposal(proposalId);
      //   console.log(proposal);
    });

    it("gets the right proposal", () => {
      expect(proposal.proposal_id).to.eq(proposalIdNum);
    });

    it("Checks for votes_for and votes_for_power matches aggregated field", async () => {
      const votesFor: any = await Vote.find({
        proposal_id: proposalIdNum,
        vote: "for",
      });

      const votesForPower = votesFor.reduce((acc: number, vote: any) => acc + vote.voting_power, 0);
      const votesForCount = votesFor.length;

      expect(proposal.votes_for).to.eq(votesForCount);
      expect(proposal.votes_for_power).to.eq(votesForPower);
    });

    it("Checks for votes_against and votes_against_power matches aggregated field", async () => {
      const votesAgainst: any = await Vote.find({
        proposal_id: proposalIdNum,
        vote: "against",
      });

      const votesAgainstPower = votesAgainst.reduce(
        (acc: number, vote: any) => acc + vote.voting_power,
        0
      );
      const votesAgainstCount = votesAgainst.length;

      expect(proposal.votes_against).to.eq(votesAgainstCount);
      expect(proposal.votes_against_power).to.eq(votesAgainstPower);
    });
  });
});
