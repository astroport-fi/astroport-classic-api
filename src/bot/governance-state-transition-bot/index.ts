import bluebird from "bluebird";
import { APIGatewayAuthorizerResultContext, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getLatestBlock, initHive, initLCD, initMantle } from "../../lib/terra";
import { TERRA_CHAIN_ID, MONGODB_URL, TERRA_HIVE, TERRA_MANTLE, TERRA_LCD } from "../../../src/constants";
import { end_proposal_vote, execute_proposal, expire_proposal } from "./triggers";
import mongoose from "mongoose";
import { Height } from "../../models";
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
  await initMantle(TERRA_MANTLE);
  await initLCD(TERRA_LCD, TERRA_CHAIN_ID);

  await mongoose.connect(MONGODB_URL);

  try {

    const start = new Date().getTime()

    const { height, time } = await getLatestBlock()

    const active_proposals = await Proposal.find({ "state": "Active" })
    const passed_proposals = await Proposal.find({ "state": "Passed" })
    const rejected_proposals = await Proposal.find({ "state": "Rejected" })


    console.log("end_proposal (Active -> Passed/Rejected)")
    await end_proposal_vote(height, active_proposals);

    console.log("execute_proposal (Passed -> Executed)")
    await execute_proposal(passed_proposals);

    console.log("remove_completed_proposal (Rejected -> Expired)")
    await expire_proposal(rejected_proposals);

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000)

  } catch (e) {
    throw new Error("Error during governance state transition: " + e);
  }

  return {
    statusCode: 200,
    body: 'Governance bot run was completed',
  };
}