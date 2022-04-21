import { expect } from "chai";
import fs from "fs";

import { calculateThirdPartyApr } from "../../../src/collector/chainIndexer/calculateApr";
import { createAstroNativeFeeLogFinder } from "../../../src/collector/logFinder/createAstroNativeFeeLogFinder";
import { getTxBlock } from "../../../src/lib/terra";
import { ScheduleType } from "../../../src/types/contracts";

describe("findXAstroFees", function () {
  it("Should get XAstroFees event from transfer log", async () => {
    const event = await getEvent(
      7335769,
      "F62C899AF33BC5490FE09C37B31ED743CD2B84EBBA6CD0AC82CFD2341254AA01",
      "transfer"
    );
    const astroNativeFeeLogFinder = createAstroNativeFeeLogFinder();
    const astroNativeFeeLogFound = astroNativeFeeLogFinder(event);
    const foundLog = astroNativeFeeLogFound.find(() => true)?.transformed;
    expect(foundLog?.amount).to.be.a("number");
    expect(foundLog?.token).to.be.a("string");
  });
});

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
