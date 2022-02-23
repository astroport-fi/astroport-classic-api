import { LCDClient, MnemonicKey, MsgExecuteContract } from "@terra-money/terra.js";
import { MAKER_CONTRACT, TRIGGER_SEED } from "../constants";
import whitelist from "./whitelist-prod.json";

// pairs to swap and distribute to xastro stakers

// mainnet
const WHITELISTED_PAIRS = ['uusd']
whitelist.mainnet.pairs.forEach( (pair) => {
  WHITELISTED_PAIRS.push(pair.contract_addr)
})

// testnet
// export const WHITELISTED_PAIRS = [
//   'uusd',
//   'terra1jqcw39c42mf7ngq4drgggakk3ymljgd3r5c3r5'] // ust, astro


export async function swap(): Promise<void> {
  const mk = new MnemonicKey({
    mnemonic: TRIGGER_SEED
  });

  // TODO change to TERRA_LCD and TERRA_CHAIN_ID
  const terra = new LCDClient({
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'bombay-12',
  });

  const wallet = terra.wallet(mk);

  // TODO switch pair_addresses to WHITELISTED PAIRS for mainnet
  // create a message to a maker contract
  const msg = new MsgExecuteContract(wallet.key.accAddress,
    MAKER_CONTRACT,
    {
      "collect": {
        "pair_addresses": [
          "terra1wd7wxlzfpwj764z7u8dm5wpuv2vhlmz4wtnj6u", // astro ust testnet
          "terra122ddg6rnvcvcwkt3xgxhh3j522993s5xxdqcm2" // anc ust testnet
        ]
      }
    });

  await wallet.createAndSignTx({msgs: [msg]}).then(tx => terra.tx.broadcast(tx)).then(result => {
    console.log(`TX hash: ${result.txhash}`);
    if ( result.logs.length >= 1 ) {
      console.log("logs.events: ", result.logs[result.logs.length - 1].events);
    }
  });
}