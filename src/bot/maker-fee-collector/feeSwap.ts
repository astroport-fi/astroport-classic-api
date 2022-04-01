import { Coin, LCDClient, MnemonicKey, MsgExecuteContract } from "@terra-money/terra.js";
import {
  MAKER_CONTRACT,
  MAKER_FEE_COLLECTOR_SEED,
  TERRA_CHAIN_ID,
  TERRA_LCD,
} from "../../constants";
import { EXECUTE_MSG } from "./whitelist-prod";
import { generate_post_fields } from "../slack-bot-backend-stats/slackHelpers";
import axios from "axios";

const SLACK_WEBHOOK =
  "https://hooks.slack.com/services/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";


export async function swap(): Promise<void> {
  const mk = new MnemonicKey({
    mnemonic: MAKER_FEE_COLLECTOR_SEED,
  });

  const terra = new LCDClient({
    URL: TERRA_LCD,
    chainID: TERRA_CHAIN_ID,
  });

  const wallet = terra.wallet(mk);

  // create a message to a maker contract
  const msg = new MsgExecuteContract(
    wallet.key.accAddress,
    MAKER_CONTRACT,
    EXECUTE_MSG
  );

  try {
    await wallet
      .createAndSignTx({ msgs: [msg], gasPrices: [new Coin("uusd", 0.15)] })
      .then((tx) => terra.tx.broadcast(tx))
      .then((result) => {
        console.log(`TX hash: ${result.txhash}`);
        if (result.logs.length >= 1) {
          console.log("logs.events: ", result.logs[result.logs.length - 1].events);
        }
      });

    const post_fields = generate_post_fields("Executed a buyback");

    const config = {
      headers: {
        "Content-Type": "application/json",
        charset: "utf-8",
      },
    };

    await axios.post(SLACK_WEBHOOK, post_fields, config);


  } catch (e) {
    console.log(e);
  }
}
