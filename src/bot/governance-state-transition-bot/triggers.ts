import { LCDClient, MnemonicKey, MsgExecuteContract, Proposal } from "@terra-money/terra.js";
import { MAKER_CONTRACT, MAKER_FEE_COLLECTOR_SEED } from "../../constants";


// active -> passed/rejected
export async function end_proposal_vote(height: number, proposals: any[]): Promise<void> {
  for(const proposal of proposals) {
    console.log(height) // TODO copy smart contract logic here to check if we need to change statek
  }
}

// passed -> executed
export async function execute_proposal(proposals: any[]): Promise<void> {
  console.log(proposals)

}

// rejected -> expired
export async function expire_proposal(proposals: any[]): Promise<void> {
  console.log(proposals)

}

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
  const msg = new MsgExecuteContract(wallet.key.accAddress,
    MAKER_CONTRACT,
    {
      "collect": {
        "pair_addresses": "WHITELISTED_PAIRS"
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