import { LCDClient, MnemonicKey, MsgExecuteContract } from "@terra-money/terra.js";
import whitelist from "./whitelist-prod.json";
import { MAKER_CONTRACT, MAKER_FEE_COLLECTOR_SEED } from "../../constants";

// pairs to swap and distribute to xastro stakers

// mainnet TODO uncomment for prod
// const WHITELISTED_PAIRS = ['uusd']
// whitelist.mainnet.pairs.forEach( (pair) => {
//   WHITELISTED_PAIRS.push(pair.contract_addr)
// })

// testnet TODO delete
export const WHITELISTED_PAIRS = [
  'terra1ec0fnjk2u6mms05xyyrte44jfdgdaqnx0upesr', // astro ust testnet
  'terra122ddg6rnvcvcwkt3xgxhh3j522993s5xxdqcm2'] // anc ust testnet


export async function swap(): Promise<void> {
  const mk = new MnemonicKey({
    mnemonic: MAKER_FEE_COLLECTOR_SEED
  });

  // TODO Important - change to TERRA_LCD and TERRA_CHAIN_ID for prod
  // TODO disable in testnet before prod deploy
  const terra = new LCDClient({
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'bombay-12',
  });

  const wallet = terra.wallet(mk);

  // TODO switch pair_addresses to WHITELISTED PAIRS for mainnet
  // create a message to a maker contract
  const msg = new MsgExecuteContract(
    wallet.key.accAddress,
    MAKER_CONTRACT,
    {
      "collect": {
        "pair_addresses": WHITELISTED_PAIRS
      }
    });

  try {
    await wallet.createAndSignTx({ msgs: [msg] }).then(tx => terra.tx.broadcast(tx)).then(result => {
      console.log(`TX hash: ${result.txhash}`);
      if (result.logs.length >= 1) {
        console.log("logs.events: ", result.logs[result.logs.length - 1].events);
      }
    });
  } catch (e) {
    console.log(e);
  }
}