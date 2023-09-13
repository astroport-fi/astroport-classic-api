import { Coin, LCDClient, MnemonicKey, MsgExecuteContract } from "@terra-money/terra.js";
import { generateExecuteMessages } from "./whitelist-prod";
import {
  generate_link_to_txn,
  generate_post_fields,
} from "../slack-bot-backend-stats/slackHelpers";
import axios from "axios";
import constants from "../../environment/constants";

const waitFor = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function swap(): Promise<void> {
  const mk = new MnemonicKey({
    mnemonic: constants.MAKER_FEE_COLLECTOR_SEED,
  });

  const terra = new LCDClient({
    URL: constants.TERRA_LCD_ENDPOINT,
    chainID: constants.TERRA_CHAIN_ID,
  });

  const wallet = terra.wallet(mk);

  const EXECUTE_MSGS = generateExecuteMessages();
  // create a message to a maker contract
  for (const swap_sublist of EXECUTE_MSGS) {
    const msg = new MsgExecuteContract(
      wallet.key.accAddress,
      constants.MAKER_ADDRESS,
      swap_sublist
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

      await waitFor(8000);
    } catch (e) {
      console.log(e);
    }
  }
}
