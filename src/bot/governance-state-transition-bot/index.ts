import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { getAssemblyConfig, getLatestBlock, initHive, initLCD } from "../../lib/terra";
import { end_proposal_vote, execute_proposal, expire_proposal } from "./triggers";
import mongoose from "mongoose";
import { Proposal } from "../../models/proposal.model";
import { hide_proposals } from "../../services/proposal.service";
import constants from "../../environment/constants";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export async function run(
  _: APIGatewayProxyEvent,
  context: APIGatewayAuthorizerResultContext
): Promise<APIGatewayProxyResult> {
  context.callbackWaitsForEmptyEventLoop = false;

  await initHive(constants.TERRA_HIVE_ENDPOINT);
  await initLCD(constants.TERRA_LCD_ENDPOINT, constants.TERRA_CHAIN_ID);

  await mongoose.connect(constants.MONGODB_URL);

  try {
    const start = new Date().getTime();

    const { height, time } = await getLatestBlock();

    // active
    const active_proposals = await Proposal.find({ state: "Active", end_block: { $lt: height } });

    // passed, rejected
    const assembly_config = await getAssemblyConfig();
    const proposal_effective_delay = assembly_config.proposal_effective_delay;
    const proposal_expiration_period = assembly_config.proposal_expiration_period;

    // valid execution window
    // end_block + proposal effective delay < height < end_block + proposal effective delay + expiration period
    const execute_block = height - proposal_effective_delay;
    const reject_block = height - (proposal_effective_delay + proposal_expiration_period);

    const passed_proposals = await Proposal.find({
      state: "Passed",
      end_block: { $lt: execute_block, $gt: reject_block },
    });

    const stale_passed_proposals = await Proposal.find({
      state: "Passed",
      end_block: { $lt: reject_block },
    });

    const rejected_proposals = await Proposal.find({
      state: "Rejected",
      end_block: { $gt: reject_block },
    });

    console.log("end_proposal (Active -> Passed/Rejected)");
    await end_proposal_vote(active_proposals);

    console.log("execute_proposal (Passed -> Executed)");
    await execute_proposal(passed_proposals);

    console.log("Hide passed proposals that went unexecuted (Passed -> Hidden");
    await hide_proposals(stale_passed_proposals);

    console.log("remove_completed_proposal (Rejected -> Expired)");
    await expire_proposal(rejected_proposals);

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  } catch (e) {
    throw new Error("Error during governance state transition: " + e);
  }

  return {
    statusCode: 200,
    body: "Governance bot run was completed",
  };
}
