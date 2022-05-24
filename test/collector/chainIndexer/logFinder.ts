import { expect } from "chai";
import fs from "fs";

import { calculateThirdPartyApr } from "collector/chainIndexer/calculateApr";
import { createAstroNativeFeeLogFinder } from "collector/logFinder/createAstroNativeFeeLogFinder";
import { getTxBlock } from "lib/terra";
import { ScheduleType } from "types/contracts";
import { vxAstroCreateLockLogFinder } from "collector/logFinder/vxAstroCreateLockLogFinder";
import { xAstroMintLogFinder } from "collector/logFinder/xAstroMintLogFinder";

describe("findXAstroFees", function () {
  it("Should get XAstroFees event from transfer log", async () => {
    const event = await getEvent(
      8767872,
      "051E4F5E7146DAD071AD774243AE21D1F32986427CD039140982C2426B274B83",
      "wasm"
    );
    const astroNativeFeeLogFinder = createAstroNativeFeeLogFinder();
    const astroNativeFeeLogFound = astroNativeFeeLogFinder(event);
    const foundLog = astroNativeFeeLogFound.find(() => true)?.transformed;
    expect(foundLog?.amount).to.be.a("number");
    expect(foundLog?.token).to.be.a("string");
  });
});

// describe("findvxLock", function () {
//   it("Should get a new create_lock event for vxAstro from transfer log", async () => {
//     const event = await getEvent(
//       8974586,
//       "F5852B3A7D15C01653C1EC42233DDC1BE6B34A675B8C3C6CCD38BAA43CD3F719",
//       "wasm"
//     );

//     const vxastroCreateLockLogFinder = vxAstroCreateLockLogFinder();
//     const vxastroCreateLockLogFound = vxastroCreateLockLogFinder(event);

//     const foundLog = vxastroCreateLockLogFound.find(() => true)?.transformed;
//     expect(foundLog?.from).to.be.a("string");
//   });
// });

// describe("findxAstro", function () {
//   it("Should get a mint for xAstro event from transfer log", async () => {
//     const event = await getEvent(
//       8763516,
//       "E2A576F5699EB4F45A0AEDD4EC207B57F508F934984C7E2C5294DF066FEFE79A",
//       "wasm"
//     );

//     const xastroMintLogFinder = xAstroMintLogFinder();
//     const xastroMintLogFound = xastroMintLogFinder(event);

//     const foundLog = xastroMintLogFound.find(() => true)?.transformed;
//     expect(foundLog?.to).to.be.a("string");
//     expect(foundLog?.amount).to.be.a("number");
//   });
// });

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
