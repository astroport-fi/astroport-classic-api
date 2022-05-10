import { connectToDatabase } from "../../modules/db";
import { Token } from "../../models";
import { getIBCDenom, initLCD } from "../../lib/terra";
import constants from "../../environment/constants";
import { captureFunctionException } from "../../lib/error-handlers";

export async function backfillIBCTokens() {
  try {
    initLCD(constants.TERRA_LCD_ENDPOINT, constants.TERRA_CHAIN_ID);
    await connectToDatabase();
    // Find all tokens starting with ibc
    const tokens = await Token.find({
      tokenAddr: /^ibc/,
    });

    console.log("Updating IBC tokens");
    for (const token of tokens) {
      const denom = await getIBCDenom(token.tokenAddr);

      token.name = constants.IBC_DENOM_MAP.get(denom)?.name || denom;
      token.symbol = constants.IBC_DENOM_MAP.get(denom)?.symbol || token.tokenAddr;

      await token.save();
    }
  } catch (error) {
    await captureFunctionException(error, {
      name: "ibc_token_info.ts/backfillBCTokens",
      message: "Unable to update IBC tokens",
    });
    return;
  }

  console.log("Updated");
  process.exit(0);
}

backfillIBCTokens();
