import { Coin, LCDClient, MnemonicKey, MsgExecuteContract } from "@terra-money/terra.js";
import {
  MAKER_CONTRACT,
  MAKER_FEE_COLLECTOR_SEED,
  TERRA_CHAIN_ID,
  TERRA_LCD,
} from "../../constants";
import { EXECUTE_MSGS } from "./whitelist-prod";
import { generate_link_to_txn, generate_post_fields } from "../slack-bot-backend-stats/slackHelpers";
import axios from "axios";

const SLACK_WEBHOOK =
  "https://hooks.slack.com/services/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";

const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

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
  for(const swap_sublist of EXECUTE_MSGS) {
    const msg = new MsgExecuteContract(
      wallet.key.accAddress,
      MAKER_CONTRACT,
      swap_sublist
    );

    try {
      let txhash = ""
      await wallet
        .createAndSignTx({ msgs: [msg], gasPrices: [new Coin("uusd", 0.15)] })
        .then((tx) => terra.tx.broadcast(tx))
        .then((result) => {
          txhash = result.txhash
          console.log(`TX hash: ${result.txhash}`);
          if (result.logs.length >= 1) {
            console.log("logs.events: ", result.logs[result.logs.length - 1].events);
          }
        });

      const post_fields = generate_link_to_txn(txhash);

      const config = {
        headers: {
          "Content-Type": "application/json",
          charset: "utf-8",
        },
      };

      await axios.post(SLACK_WEBHOOK, post_fields, config);

      await waitFor(1000)

    } catch (e) {
      console.log(e);
    }
  }
}
