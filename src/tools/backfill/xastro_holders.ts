import { connectToDatabase } from "../../modules/db";
import { Token } from "../../models";
import { getIBCDenom, getxAstroAccounts, initHive, initLCD } from "../../lib/terra";
import constants from "../../environment/constants";
import { captureFunctionException } from "../../lib/error-handlers";
import { UserGovernancePosition } from "../../models/user_governance_position.model";

// Log all existing xAstro holders by querying the contract directly
// instead of scanning blocks
export async function backfillxAstroHolders() {
  try {
    initHive(constants.TERRA_HIVE_ENDPOINT);
    await connectToDatabase();

    // Query the xAstro contract's AllAccounts until the result is
    // a blank array
    // We insert a blank string as the first item to use as the 'last address'
    // for paging
    let accounts = [""];
    while (accounts.length > 0) {
      accounts = await getxAstroAccounts(constants.XASTRO_TOKEN, accounts[accounts.length - 1], 30);

      for (const account of accounts) {
        console.log(account);

        await UserGovernancePosition.create({
          address: account,
        });
      }
    }
  } catch (error) {
    await captureFunctionException(error, {
      name: "xastro_holders.ts/backfillBCTokens",
      message: "Unable to fetch xAstro holders",
    });
    return;
  }

  console.log("Updated");
  process.exit(0);
}

backfillxAstroHolders();
