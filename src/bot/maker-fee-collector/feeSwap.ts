import { Coin, LCDClient, MnemonicKey, MsgExecuteContract } from "@terra-money/terra.js";
import {
  MAKER_CONTRACT,
  MAKER_FEE_COLLECTOR_SEED,
  TERRA_CHAIN_ID,
  TERRA_LCD,
} from "../../constants";
import { EXECUTE_MSG } from "./whitelist-prod";

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
  } catch (e) {
    console.log(e);
  }
}
