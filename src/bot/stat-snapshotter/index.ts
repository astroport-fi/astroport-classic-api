import bluebird from "bluebird";
import { snapshot } from "./snapshot";
import { lambdaHandlerWrapper } from "../../lib/handler-wrapper";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export const run = lambdaHandlerWrapper(
  async (): Promise<void> => {
    const start = new Date().getTime();

    console.log("Collecting a snapshot of all stats...");
    await snapshot();

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000);
  },
  {
    successMessage: "Archived",
    errorMessage: "Error while swapping maker fees: ",
  }
);
