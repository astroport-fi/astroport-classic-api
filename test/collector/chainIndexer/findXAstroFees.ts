import { expect } from "chai";
import fs from "fs";

import { calculateThirdPartyApr } from "../../../src/collector/chainIndexer/calculateApr";
import { createAstroNativeFeeLogFinder } from "../../../src/collector/logFinder/createAstroNativeFeeLogFinder";
import { getTxBlock } from "../../../src/lib/terra";
import { ScheduleType } from "../../../src/types/contracts";

describe("findXAstroFees", function () {
  it("Should get XAstroFees event from transfer log", async () => {
    const event = await getEvent(
      7347001,
      "70BD4D64467FAD9631EC4A42AAC59F9D833105ACF9F6C4F62E9E96C1491D9EF3",
      "wasm"
    );
    const astroNativeFeeLogFinder = createAstroNativeFeeLogFinder();
    const astroNativeFeeLogFound = astroNativeFeeLogFinder(event);
    const foundLog = astroNativeFeeLogFound.find(() => true)?.transformed;
    expect(foundLog?.amount).to.be.a("number");
    expect(foundLog?.token).to.be.a("string");
  });
});

//TOD simplify and make reusable for other tests
async function getEvent(height: number, txnHash: string, type: string) {
  const txs = await getTxBlock(height);
  for (const tx of txs) {
    const Logs = tx.logs;
    const timestamp = tx.timestamp;
    const txHash = tx.txhash;

    for (const log of Logs) {
      const events = log.events;

      for (const event of events) {
        // for spam tx
        if (event.attributes.length < 1800) {
          //   console.log(event);
          if (tx.txhash == txnHash && event.type == type) {
            //  && log.msg_index == msg_index) { // unsure if this works
            return event;
          }
        }
      }
    }
  }
}
