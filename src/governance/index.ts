import bluebird from "bluebird";
import { governanceProposalCollect } from "./governanceProposalCollect";
import { lambdaHandlerWrapper } from "../lib/handler-wrapper";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export const run = lambdaHandlerWrapper(
  async (): Promise<void> => {
    const start = new Date().getTime();
    console.log("Checking for new governance proposals...");
    await governanceProposalCollect();
    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  },
  {
    errorMessage: "Error while running governance indexer: ",
  }
);
