import { vxAstroCreateLockLogFinder } from "../logFinder/vxAstroCreateLogFinder";

export async function findvxAstroLock(event: any): Promise<number> {
  // const blockFees = new Set<XAstroFeeTransformed>();

  // get vxAstro create_lock events
  const vxastroCreateLockLogFinder = vxAstroCreateLockLogFinder();
  const vxastroCreateLockLogFound = vxastroCreateLockLogFinder(event);

  if (vxastroCreateLockLogFound) {
    for (const found of vxastroCreateLockLogFound) {
      const transformed = found.transformed;

      if (transformed != null) {
        console.log("LOCK vxAstro", transformed.from, transformed.amount);
        // blockFees.add({
        //   token: transformed.token,
        //   amount: transformed.amount,
        // });
      }
    }
  }

  return 0;
}
