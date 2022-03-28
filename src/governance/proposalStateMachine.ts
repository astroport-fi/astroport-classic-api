/**
 * Decides whether a proposal state transition is valid
 * Pushes notification to slack webhook if rule set
 */

export enum ProposalState {
  Active,
  Passed,
  Rejected,
  Executed,
  Expired, // terminal
  Hidden // Passed proposals that were never executed
}

// update a proposal's state change timestamps
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/ban-ts-comment
// @ts-ignore
export function update_proposal_timestamps(saved: any, new_proposal: any) {
  if (new_proposal.status == ProposalState[ProposalState.Passed]) {
    new_proposal.passed = new Date().toISOString();
  } else if (new_proposal.status == ProposalState[ProposalState.Rejected]) {
    new_proposal.rejected = new Date().toISOString();
  } else if (new_proposal.status == ProposalState[ProposalState.Executed]) {
    new_proposal.executed = new Date().toISOString();
  } else if (new_proposal.status == ProposalState[ProposalState.Expired]) {
    new_proposal.expired = new Date().toISOString();
  } else {
    console.log(
      "New proposal's state was: " +
        new_proposal.status +
        " during update_proposal_timestamps, not updating"
    );
  }
}
