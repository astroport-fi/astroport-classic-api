import { xAstroMintLogFinder } from "../logFinder/xAstroMintLogFinder";
import { UserGovernancePosition } from "../../models/user_governance_position.model";

/**
 * Find mint actions taken on xAstro
 *
 * @param event The transaction log event
 */
export async function findxAstroMint(event: any): Promise<void> {
  const xastroMintLogFinder = xAstroMintLogFinder();
  const xastroMintLogFound = xastroMintLogFinder(event);

  if (xastroMintLogFound) {
    for (const found of xastroMintLogFound) {
      const transformed = found.transformed;

      if (transformed != null) {
        // Found a mint event, log the user's address (transformed.to) to
        // have their balance indexed
        try {
          await UserGovernancePosition.create({
            address: transformed.to,
          });
        } catch (e) {
          // No need to report duplicates, but other errors should be
          if (e.name !== "MongoServerError" && e.code !== 11000) {
            throw e;
          }
        }
      }
    }
  }
}
