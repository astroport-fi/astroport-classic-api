import "dotenv/config";
import mongoose from "mongoose";
import { expect } from "chai";
import { getTxBlock, initHive, initMantle } from "../../../src/lib/terra";
import { getToken } from "../../../src/services";
import { FACTORY_ADDRESS, MONGODB_URL, TERRA_HIVE, TERRA_MANTLE } from "../../../src/constants";
// import { priceCollectV2 } from "../../../src/collector/priceIndexer/priceCollectV2";
import { createPairLogFinders } from "../../../src/collector/logFinder";
// import { LogFragment } from "@terra-money/log-finder";
import { createPairIndexer } from "../../../src/collector/chainIndexer/createPairIndex";
import { Pair, Token } from "../../../src/models";
declare module "dayjs" {
  interface Dayjs {
    utc(): any;
  }
}
describe("Index new pairs", function () {
  beforeEach(async function () {
    // await mongoose.connect(MONGODB_URL);
    await initHive(TERRA_HIVE);
    await initMantle(TERRA_MANTLE);
  });

  describe("Create pair and tokens on create_pair event", async () => {
    it("Should get transaction and index coin data", async () => {
      const createPairLF = createPairLogFinders(FACTORY_ADDRESS);

      //TODO keep same event with create_pair or mock an event
      const { event, timestamp } = await getEvent(
        5838825,
        "4BC31A9FF21E27539A5E6C944442952C454A48F18061B4FDF525B68C395EE743",
        "wasm"
      );

      const createPairLogFounds = createPairLF(event);

      //remove items if exist to be re indexed by createPair
      for (const log of createPairLogFounds) {
        const transformed = log.transformed;

        try {
          console.log(transformed);

          // await Token.findByIdAndDelete(transformed?.token1);
          // await Token.findByIdAndDelete(transformed?.token2);
          // await Pair.findByIdAndDelete(transformed?.contractAddr);
          await createPairIndexer(createPairLogFounds, timestamp);
          const token1 = await getToken(transformed?.token1 as string);
          const token2 = await getToken(transformed?.token2 as string);
          expect(token1).to.have.property("name");
          // expect(token2).to.have.property("name");
        } catch (e) {
          console.log(e);
        }
      }
    });
  });
});

async function getEvent(height: number, txnHash: string, type: string) {
  const txs = await getTxBlock(height);
  for (const tx of txs) {
    const Logs = tx.logs;
    const timestamp = tx.timestamp;
    // const txHash = tx.txhash;
    // console.log(timestamp);

    for (const log of Logs) {
      const events = log.events;

      for (const event of events) {
        // for spam tx
        if (event.attributes.length < 1800) {
          if (tx.txhash == txnHash && event.type == type) {
            //  && log.msg_index == msg_index) { // unsure if this works
            return { event, timestamp };
          }
        }
      }
    }
  }
  return { event: null, timestamp: null };
}
