import {
  Coin,
  CreateTxOptions,
  isTxError,
  LCDClient,
  MnemonicKey,
  MsgExecuteContract
} from "@terra-money/terra.js";
import {
  GOVERNANCE_ASSEMBLY, GOVERNANCE_TRIGGER_BOT_SEED,
  MAKER_CONTRACT,
  MAKER_FEE_COLLECTOR_SEED
} from "../../constants";
import { Proposal } from "../../models/proposal.model";

// active -> passed/rejected
export async function end_proposal_vote(proposals: any[]): Promise<void> {
  for(const proposal of proposals) {
    await assembly_msg({
        "end_proposal": {
          "proposal_id": proposal.proposal_id
        }
      }
    )
  }
}

// passed -> executed
export async function execute_proposal(proposals: any[]): Promise<void> {
  for(const proposal of proposals) {
    await assembly_msg({
        "execute_proposal": {
          "proposal_id": proposal.proposal_id
        }
      }
    )
  }
}

// rejected -> expired
// because this removes the proposal from the smart contract, we update
// the Proposal database entry as well
export async function expire_proposal(proposals: any[]): Promise<void> {
  for(const proposal of proposals) {
    await assembly_msg({
        "remove_completed_proposal": {
          "proposal_id": proposal.proposal_id
        }
      }
    )

    await Proposal.updateOne(
      {
        proposal_id: Number(proposal.proposal_id)
      },
      {
        $set: {
          state:  "Expired",
          expired:  new Date().toISOString()
        }
      }
    )
  }
}

export async function assembly_msg(message: any): Promise<void> {
  const mk = new MnemonicKey({
    mnemonic: GOVERNANCE_TRIGGER_BOT_SEED
  });

  // TODO Important - change to TERRA_LCD and TERRA_CHAIN_ID for prod
  // TODO disable in testnet before prod deploy
  const terra = new LCDClient({
    URL: 'https://bombay-lcd.terra.dev',
    chainID: 'bombay-12',
  });

  const wallet = terra.wallet(mk);

  // create a message to a maker contract
  const executeMsg = new MsgExecuteContract(
    wallet.key.accAddress,
    GOVERNANCE_ASSEMBLY,
    message);

  const options: CreateTxOptions = {
    msgs: [executeMsg],
    gasPrices: [new Coin("uusd", 0.15)],
    memo: ""
  };

  const tx = await wallet.createAndSignTx(options);
  const result = await terra.tx.broadcast(tx);

  if (isTxError(result)) {
    console.log("governance throw");
    throw new Error(
      `transaction failed. code: ${result.code}, codespace: ${result.codespace}, raw_log: ${result.raw_log}`
    );
  }
}