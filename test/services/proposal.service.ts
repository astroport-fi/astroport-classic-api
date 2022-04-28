import { expect } from "chai";
import { getProposal } from "../../src/services/proposal.service";

describe("services/proposal.service", function () {
  describe("getProposal", function () {
    let proposal: any;
    const proposalId = "11";

    before(async () => {
      proposal = await getProposal(proposalId);
      // console.log(proposal);
    });

    it("gets the right proposal", () => {
      expect(proposal.proposal_id).to.eq(proposalId);
    });

    //TODO add back test when data in dev db is re indexed.
  });
});
