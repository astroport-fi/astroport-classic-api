/**
 * Decides whether a proposal state transition is valid
 * Pushes notification to slack webhook if rule set
 */

export enum ProposalState {
  Active,
  Passed,
  Rejected,
  Executed,
  Expired
}

const VALID_TRANSITIONS: [ProposalState, ProposalState][] = [
  [ProposalState.Active, ProposalState.Expired],
  [ProposalState.Active, ProposalState.Rejected],
  [ProposalState.Active, ProposalState.Passed],
  [ProposalState.Passed, ProposalState.Executed]
  ];


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/ban-ts-comment
// @ts-ignore
export function isValidTransistion(from, to): boolean {
  return VALID_TRANSITIONS.includes([from.state as ProposalState, to.state as ProposalState])
}

