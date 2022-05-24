import bluebird from "bluebird";
import { lambdaHandlerWrapper } from "../lib/handler-wrapper";
import { userGovernanceCollect } from "./userGovernanceCollect";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export const run = lambdaHandlerWrapper(
  async (): Promise<void> => {
    const start = new Date().getTime();
    console.log("Indexing user positions...");

    // Collect all xAstro and vxAstro positions
    await userGovernanceCollect();

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  },
  {
    errorMessage: "Error while running user indexer: ",
  }
);
