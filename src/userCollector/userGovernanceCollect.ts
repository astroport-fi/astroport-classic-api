import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isoWeek from "dayjs/plugin/isoWeek";
import constants from "../environment/constants";
import { BatchQuery } from "../types/hive.type";
import { batchQuery } from "../lib/terra";
import { UserGovernancePosition } from "../models/user_governance_position.model";
import { UserGovernancePosition as UserGovernancePositionType } from "../types/user_governance_position.type";

import { batchItems } from "../collector/priceIndexer/util";

dayjs.extend(utc);
dayjs.extend(isoWeek);

const MONGO_BATCH_SIZE = 100;
const HIVE_BATCH_SIZE = 30;

/**
 * userGovernanceCollect extracts user specific positions from contracts
 * that relate to governance such as xAstro and vxAstro by fetching the
 * known list of addresses that interacted with either xAstro of vxAstro in
 * the past
 */
export async function userGovernanceCollect(): Promise<void> {
  // Query all balances of all holders of xAstro and vxAstro

  // Fetch MONGO_BATCH_SIZE amount of records from the database
  let page = 0;
  let recordCount = MONGO_BATCH_SIZE;
  while (recordCount == MONGO_BATCH_SIZE) {
    const users = await UserGovernancePosition.find()
      .skip(page * MONGO_BATCH_SIZE)
      .limit(MONGO_BATCH_SIZE);
    const vxAstroUsers: UserGovernancePositionType[] = [];

    // Batch addresses to fetch xAstro and vxAstro positions from Hive
    const userBatches = batchItems(users, HIVE_BATCH_SIZE);
    for (const userBatch of userBatches) {
      const queries: BatchQuery[] = [];
      for (const user of userBatch) {
        // Get this address' vxAstro balance, non-existent addresses return 0
        // instead of an error which is safe to batch
        queries.push({
          query: `
            query ($contract: String!, $userAddress: String!) {
              wasm {
                contractQuery(contractAddress: $contract, query:  {
                  balance: {
                      address: $userAddress
                  }
                })
              }
            }
          `,
          variables: {
            contract: constants.XASTRO_TOKEN,
            userAddress: user.address,
          },
        });
        // Get this address' vxAstro balance, non-existent addresses return 0
        // instead of an error which is safe to batch
        queries.push({
          query: `
            query ($contract: String!, $userAddress: String!) {
              wasm {
                contractQuery(contractAddress: $contract, query:  {
                  balance: {
                      address: $userAddress
                  }
                })
              }
            }
          `,
          variables: {
            contract: constants.VXASTRO_TOKEN,
            userAddress: user.address,
          },
        });
      }
      // Submit query and process responses
      if (queries.length > 0) {
        const responses = await batchQuery(queries);
        if (responses) {
          // responseIndex is tracked separately because some pairs have
          // an additional generator response
          let responseIndex = 0;

          // Remap responses to the original queries for this batch
          for (let i = 0; i < userBatch.length; i++) {
            const user = userBatch[i];
            // Capture first response for this address
            const xAstroResponse = responses[responseIndex];
            // Move to second response for this address
            responseIndex++;
            const vxAstroResponse = responses[responseIndex];

            const xastroBalance = +xAstroResponse.data.wasm.contractQuery.balance;
            const vxastroBalance = +vxAstroResponse.data.wasm.contractQuery.balance;

            // To get the vxAstro lock information we need to be sure the user has
            // a position in vxAstro and only query when true as the vxAstro
            // contract will return an error if you query a non-existent address
            if (vxastroBalance !== 0) {
              vxAstroUsers.push(user);
            }

            try {
              await UserGovernancePosition.updateOne(
                {
                  address: user.address,
                },
                {
                  $set: {
                    xastroBalance,
                    vxastroBalance,
                  },
                },
                { upsert: true }
              );
            } catch (e) {
              console.log("Unable to update user xAstro and vxAstro balances", e);
            }

            responseIndex++;
          }
        }
      }
    }

    // We query the vxAstro lock information within the same Mongo batch
    // as to not end up with thousands in the array but rather the maximum of
    // MONGO_BATCH_SIZE

    const vxAstroUserBatches = batchItems(vxAstroUsers, HIVE_BATCH_SIZE);
    for (const vxAstroUserBatch of vxAstroUserBatches) {
      const queries: BatchQuery[] = [];
      for (const user of vxAstroUserBatch) {
        // Get this address' vxAstro balance, non-existent addresses return 0
        // instead of an error which is safe to batch
        queries.push({
          query: `
            query ($contract: String!, $userAddress: String!) {
              wasm {
                contractQuery(contractAddress: $contract, query:  {
                  lock_info: {
                    user: $userAddress
                  }
                })
              }
            }
          `,
          variables: {
            contract: constants.VXASTRO_TOKEN,
            userAddress: user.address,
          },
        });
      }
      // Submit query and process responses
      if (queries.length > 0) {
        const responses = await batchQuery(queries);
        if (responses) {
          // Remap responses to the original queries for this batch
          for (let i = 0; i < vxAstroUserBatch.length; i++) {
            const user = vxAstroUserBatch[i];
            // Capture first response for this address
            const vxAstroLockResponse = responses[i];

            // Start and end is specified in weeks
            const start = +vxAstroLockResponse.data.wasm.contractQuery.start;
            const end = +vxAstroLockResponse.data.wasm.contractQuery.end;
            const weeksLeft = end - start;

            // Calculate the date this lock will end by adding weeks left
            // to the start of this week

            // Note: The time the lock ends it rounded down by week
            // https://github.com/astroport-fi/astroport-governance/blob/main/packages/astroport-governance/src/utils.rs#L6

            // Dayjs provides Sunday 00:00 as the start of the week, however,
            // the contract uses Monday 00:00 as the start of the week which
            // is why we use isoWeek that sets Monday as the start of the week
            const currentWeekStart = dayjs.utc().startOf("isoWeek");
            const lockEnd = currentWeekStart.add(weeksLeft, "weeks");

            try {
              await UserGovernancePosition.updateOne(
                {
                  address: user.address,
                },
                {
                  $set: {
                    vxLockEndTimestamp: lockEnd.unix(),
                  },
                },
                { upsert: true }
              );
            } catch (e) {
              console.log("Unable to update user vxAstro lock end timestamp", e);
            }
          }
        }
      }
    }

    recordCount = users.length;
    page += 1;
  }
}
