import { createReturningLogFinder, ReturningLogFinderMapper } from "@terra-money/log-finder";

import * as logRules from "./logRules";
import { governanceVoteRule } from "./logRules";

export function voteLogFinder(): ReturningLogFinderMapper<{
  proposal_id: number;
  voter: string;
  vote: string;
  voting_power: number;
}> {
  return createReturningLogFinder(logRules.governanceVoteRule(), (_, match) => {
    return {
      proposal_id: Number(match[2].value),
      voter: match[3].value as string,
      vote: match[4].value as string,
      voting_power: Number(match[5].value),
    };
  });
}
