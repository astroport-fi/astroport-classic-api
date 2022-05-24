import { vxAstroCreateLockLogFinder } from "../logFinder/vxAstroCreateLockLogFinder";
import { UserGovernancePosition } from "../../models/user_governance_position.model";

/**
 * Find create_lock actions taken on vxAstro
 *
 * @param event The transaction log event
 */
export async function findvxAstroLock(event: any): Promise<void> {
  const vxastroCreateLockLogFinder = vxAstroCreateLockLogFinder();
  const vxastroCreateLockLogFound = vxastroCreateLockLogFinder(event);

  if (vxastroCreateLockLogFound) {
    for (const found of vxastroCreateLockLogFound) {
      const transformed = found.transformed;

      if (transformed != null) {
        // Found a create_lock event, log the user's address (transformed.from) to
        // have their balance indexed
        try {
          await UserGovernancePosition.create({
            address: transformed.from,
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
