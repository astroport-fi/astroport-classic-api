import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { getAssemblyConfig, getLatestBlock, initHive, initLCD, initMantle } from "../../lib/terra";
import {
  TERRA_CHAIN_ID,
  MONGODB_URL,
  TERRA_HIVE,
  TERRA_MANTLE,
  TERRA_LCD,
} from "../../../src/constants";
import { end_proposal_vote, execute_proposal, expire_proposal } from "./triggers";
import mongoose from "mongoose";
import { Proposal } from "../../models/proposal.model";

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

  await initHive(TERRA_HIVE);
  await initLCD(TERRA_LCD, TERRA_CHAIN_ID);

  await mongoose.connect(MONGODB_URL);

  try {
    const start = new Date().getTime();

    const { height, time } = await getLatestBlock();

    // active
    const active_proposals = await Proposal.find({ state: "Active", end_block: { $lt: height } });

    // passed, rejected
    const assembly_config = await getAssemblyConfig();
    const proposal_effective_delay = assembly_config.proposal_effective_delay;
    const proposal_expiration_period = assembly_config.proposal_expiration_period;

    // execute_block is the block when a passed proposal is ready to execute
    // height > end_block + proposal effective delay
    const execute_block = height - proposal_effective_delay;

    // reject_block is the block when a rejected proposal is ready to expire
    // height > end + delay + expir
    const reject_block = height - (proposal_effective_delay + proposal_expiration_period);

    const passed_proposals = await Proposal.find({
      state: "Passed",
      end_block: { $gt: execute_block },
    });
    const rejected_proposals = await Proposal.find({
      state: "Rejected",
      end_block: { $gt: reject_block },
    });

    await end_proposal_vote(active_proposals);

    console.log("end_proposal (Active -> Passed/Rejected)");
    await end_proposal_vote(active_proposals);

    console.log("execute_proposal (Passed -> Executed)");
    await execute_proposal(passed_proposals);

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
