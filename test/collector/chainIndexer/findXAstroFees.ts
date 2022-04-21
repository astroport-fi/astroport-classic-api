import { expect } from "chai";
import fs from "fs";

import { calculateThirdPartyApr } from "../../../src/collector/chainIndexer/calculateApr";
import { createAstroNativeFeeLogFinder } from "../../../src/collector/logFinder/createAstroNativeFeeLogFinder";
import { getTxBlock } from "../../../src/lib/terra";
import { ScheduleType } from "../../../src/types/contracts";

describe("findXAstroFees", function () {
  it("Should get XAstroFees", async () => {
    const event = await getEvent(
      7329203,
      "B83170A6C28E7B981B0259BDA1555CB15BE68D6CB2E9BC7A12C71E1EFC0BA79A",
      "wasm"
    );
    const astroNativeFeeLogFinder = createAstroNativeFeeLogFinder();
    await fs.writeFileSync("file2.json", JSON.stringify(event));
    const astroNativeFeeLogFound = astroNativeFeeLogFinder(event);
    await fs.writeFileSync("file.json", JSON.stringify(astroNativeFeeLogFound));
    console.log(astroNativeFeeLogFound);
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
