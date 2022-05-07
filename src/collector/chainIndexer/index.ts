import { createPairLogFinders, createSwapLogFinder } from "../logFinder";
import { createPairIndexer } from "./createPairIndex";
import { findProtocolRewardEmissions } from "./findProtocolRewardEmissions";
import { findXAstroFees } from "./findXAstroFees";
import { voteLogFinder } from "../logFinder/voteLogFinder";
import { voteIndexer } from "./voteIndexer";
import { getProxyAddressesInfo } from "../proxyAddresses";
import constants from "../../environment/constants";
import { ProxyAddressInfo } from "../../types/contracts";
import { getPrices } from "../../services/priceV2.service";
import { priceListToMap } from "../../collector/helpers";

/**
 * Indexes transactions for a single block
 * @param txs
 * @param height
 * @param pairMap
 * @param priceMap
 */
export async function runIndexers(txs: any, height: number): Promise<void> {
  const generatorProxyContracts = await getProxyAddressesInfo();
  const prices = await getPrices();
  const priceMap = priceListToMap(prices);

  for (const tx of txs) {
    const Logs = tx.logs;
    const timestamp = tx.timestamp;
    const txHash = tx.txhash;

    for (const log of Logs) {
      const events = log.events;

      for (const event of events) {
        // for spam tx
        if (event.attributes.length < 1800) {
          // createPair
          try {
            const createPairLF = createPairLogFinders(constants.FACTORY_ADDRESS);
            const createPairLogFounds = createPairLF(event);
            if (createPairLogFounds.length > 0) {
              await createPairIndexer(createPairLogFounds, timestamp, txHash);
            }
          } catch (e) {
            console.log("Error during createPair: " + e);
          }

          // find votes
          try {
            const voteLF = voteLogFinder();
            const voteLogFounds = voteLF(event);
            if (voteLogFounds.length > 0) {
              await voteIndexer(voteLogFounds, timestamp, height, txHash);
            }
          } catch (e) {
            console.log("Error while indexing votes: " + e);
          }

          // find events for APR
          try {
            await findProtocolRewardEmissions(event, height, generatorProxyContracts);
          } catch (e) {
            console.log("Error during findProtocolRewardEmissions: " + e);
          }

          try {
            // xAstro fees sent to maker
            await findXAstroFees(event, height, priceMap);
          } catch (e) {
            console.log("Error during findXAstroFees: " + e);
          }
        }
      }
    }
  }
}

/**
 * Duplicate of runIndexers but with generator proxies provided for speedup
 * Indexes transactions for a single block with the provided generator proxy contracts
 *
 * @param txs
 * @param height
 * @param pairMap
 * @param priceMap
 */
export async function runIndexersWithProxies(
  txs: any,
  height: number,
  generatorProxyContracts: Map<string, ProxyAddressInfo>
): Promise<void> {
  const prices = await getPrices();
  const priceMap = priceListToMap(prices);
  for (const tx of txs) {
    const Logs = tx.logs;
    const timestamp = tx.timestamp;
    const txHash = tx.txhash;

    for (const log of Logs) {
      const events = log.events;

      for (const event of events) {
        // for spam tx
        if (event.attributes.length < 1800) {
          // createPair
          try {
            const createPairLF = createPairLogFinders(constants.FACTORY_ADDRESS);
            const createPairLogFounds = createPairLF(event);
            if (createPairLogFounds.length > 0) {
              await createPairIndexer(createPairLogFounds, timestamp, txHash);
            }
          } catch (e) {
            console.log("Error during createPair: " + e);
          }

          // find votes
          try {
            const voteLF = voteLogFinder();
            const voteLogFounds = voteLF(event);
            if (voteLogFounds.length > 0) {
              await voteIndexer(voteLogFounds, timestamp, height, txHash);
            }
          } catch (e) {
            console.log("Error while indexing votes: " + e);
          }

          // find events for APR
          try {
            await findProtocolRewardEmissions(event, height, generatorProxyContracts);
          } catch (e) {
            console.log("Error during findProtocolRewardEmissions: " + e);
          }

          try {
            // xAstro fees sent to maker
            await findXAstroFees(event, height, priceMap);
          } catch (e) {
            console.log("Error during findXAstroFees: " + e);
          }
        }
      }
    }
  }
}
