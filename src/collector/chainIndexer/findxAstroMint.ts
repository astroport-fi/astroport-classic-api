import { xAstroMintLogFinder } from "../logFinder/xAstroMintLogFinder";

export async function findxAstroMint(event: any): Promise<number> {
  // const blockFees = new Set<XAstroFeeTransformed>();

  // get xAstro mint events
  const xastroMintLogFinder = xAstroMintLogFinder();
  const xastroMintLogFound = xastroMintLogFinder(event);

  if (xastroMintLogFound) {
    for (const found of xastroMintLogFound) {
      const transformed = found.transformed;

      if (transformed != null) {
        console.log("MINT xAstro", transformed.to, transformed.amount);
        // blockFees.add({
        //   token: transformed.token,
        //   amount: transformed.amount,
        // });
      }
    }
  }

  return 0;
}
