import { xAstroFee } from "../../models/xastro_fee.model";
import { xAstroFee as xAstroFeeType } from "../../types/xastro_fee.type";
import { createAstroCW20FeeLogFinder } from "../logFinder/createAstroCW20FeeLogFinder";
import { createAstroNativeFeeLogFinder } from "../logFinder/createAstroNativeFeeLogFinder";
import { XAstroFeeTransformed } from "../../types";

export async function findXAstroFees(event: any, height: number): Promise<xAstroFeeType[]> {
  const blockFees = new Set<XAstroFeeTransformed>();

  // get cw20 rewards
  const astroCW20FeeLogFinder = createAstroCW20FeeLogFinder();
  const astroCW20FeeLogFound = astroCW20FeeLogFinder(event);

  if (astroCW20FeeLogFound) {
    for (const found of astroCW20FeeLogFound) {
      const transformed = found.transformed;

      if (transformed != null) {
        blockFees.add({
          token: transformed.token,
          amount: transformed.amount,
        });
      }
    }
  }

  // get native terra asset rewards
  const astroNativeFeeLogFinder = createAstroNativeFeeLogFinder();
  const astroNativeFeeLogFound = astroNativeFeeLogFinder(event);

  if (astroNativeFeeLogFound) {
    for (const found of astroNativeFeeLogFound) {
      const transformed = found.transformed;

      if (transformed != null) {
        blockFees.add({
          token: transformed.token,
          amount: transformed.amount,
        });
      }
    }
  }

  // save to db
  const fees: xAstroFeeType[] = [];
  for (const fee of blockFees) {
    try {
      const createdFee = await xAstroFee.create({
        token: fee.token,
        volume: fee.amount,
        block: height,
      });
      if (createdFee) {
        fees.push(createdFee);
      }
    } catch (e) {
      // console.log("Error finding xastro fees: " + e)
    }
  }
  return fees;
}
