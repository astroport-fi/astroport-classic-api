import { Pair } from "../../types";
import { PriceGraphNode } from "./price_graph_node";
import { PriceGraphEdge } from "./price_graph_edge";
import { getBlock } from "../../services";
import { getAssetAmountsInPool, getPricesFromPool, isNative } from "../../modules/terra";
import { batchQuery, getPool } from "../../lib/terra";
import { batchItems, getExchangeRate } from "./util";
import { PriceV2 } from "../../models/price_v2.model";
import { BatchQuery } from "../../types/hive.type";
import constants from "../../environment/constants";

/**
 * created unweighted directed graph
 * tokens are nodes, edges contain exchange rate
 * only works for astroport tokens
 * @param pairs
 */
export async function priceCollectV2(pairs: Pair[]): Promise<void> {
  const block = await getBlock("columbus-5");
  const height = block.hiveHeight;
  // get/calculate prices
  const prices = await indexPrices(pairs, height);
  // update prices
  await savePrices(prices);
}

/**
 * Determines prices for the given list of pairs at the
 * provided block height
 *
 * @param pairs The pairs to determine prices for
 * @param height The height of the chain to work at
 * @returns The prices for the pairs
 */
export async function indexPrices(
  pairs: Pair[],
  height: number = 0
): Promise<Map<string, PriceGraphNode>> {
  // map token addresses to nodes
  const nodes = new Map<string, PriceGraphNode>();
  // adjacency list - maps token address to a node's edges
  const edges = new Map<string, PriceGraphEdge[]>();

  // Remove deregistered pools from the list
  const activePairs = pairs.filter((pair) => {
    return !pair.deregistered;
  });
  // add nodes (tokens) of pairs not deregistered
  for (const pair of activePairs) {
    for (const token of [pair.token1, pair.token2]) {
      const node = new PriceGraphNode();

      if (nodes.has(token)) continue;

      node.token_address = token;
      node.is_external = false;

      nodes.set(node.token_address, node);
      edges.set(node.token_address, []);
    }
  }

  // pairBatchSize determines the amount of pairs put into a Hive query batch
  // 30 is a sane value to balance potential query failures and performance
  const pairBatchSize = 30;
  const pairsBatches = batchItems(activePairs, pairBatchSize);
  for (const pairBatch of pairsBatches) {
    const queries: BatchQuery[] = [];
    for (const pair of pairBatch) {
      // Add pool query
      queries.push({
        query: `
          query ($height: Float!, $contract: String!) {
            wasm {
              contractQuery(height: $height, contractAddress: $contract, query: { pool: {} })
            }
          }
        `,
        variables: {
          height,
          contract: pair.contractAddr,
        },
      });

      if (pair.type === "stable") {
        const amount: number = constants.TOKENS_WITH_8_DIGITS.has(pair.token1)
          ? 100000000
          : 1000000;
        let query = {};
        if (isNative(pair.token1)) {
          query = { native_token: { denom: pair.token1 } };
        } else {
          query = { token: { contract_addr: pair.token1 } };
        }

        queries.push({
          query: `
            query ($address: String!, $query: JSON!, $amount: String!) {
              wasm {
                contractQuery(
                  contractAddress: $address
                  query: { simulation: { offer_asset: { info: $query, amount: $amount } } }
                )
              }
            }
          `,
          variables: {
            address: pair.contractAddr,
            query,
            amount: String(amount),
          },
        });
      }
    }

    // Submit query and process responses
    if (queries.length > 0) {
      const responses = await batchQuery(queries);
      if (responses) {
        // responseIndex is tracked separately because some pairs have
        // an additional pricing response
        let responseIndex: number = 0;
        // Remap responses to the original queries for this batch
        for (let i = 0; i < pairBatch.length; i++) {
          const pair = pairBatch[i];
          const pool = responses[responseIndex].data.wasm.contractQuery;
          const pool_type: string = pair.type;
          // For stable pools we fetched additional information
          let stableSwapRelativePrice: number = 0;
          if (pool_type === "stable") {
            // Move the response index on by one to capture the second query result
            responseIndex++;
            // For stable pairs we already fetched the token 1 price, and don't
            // need to do it again avoiding another Hive query
            stableSwapRelativePrice =
              responses[responseIndex].data.wasm.contractQuery.return_amount;
          }

          // Move to next item so long, otherwise we need to specify it in
          // multiple places
          responseIndex++;

          const prices = await getPricesFromPool(
            pool,
            pair.contractAddr,
            pair.token1,
            pair.token2,
            pool_type,
            stableSwapRelativePrice
          );
          if (
            prices.token1 == "NaN" ||
            prices.token1 == "Infinity" ||
            prices.token2 == "NaN" ||
            prices.token2 == "Infinity" ||
            !nodes.has(pair.token1) ||
            !nodes.has(pair.token2)
          ) {
            // this happens too often to log
            continue;
          }
          const edge1 = new PriceGraphEdge();
          edge1.from = nodes.get(pair.token1) as PriceGraphNode;
          edge1.to = nodes.get(pair.token2) as PriceGraphNode;
          edge1.exchangeRate = prices.token1 as number;
          const edge2 = new PriceGraphEdge();
          edge2.from = nodes.get(pair.token2) as PriceGraphNode;
          edge2.to = nodes.get(pair.token1) as PriceGraphNode;
          edge2.exchangeRate = prices.token2 as number;
          if (edges.has(pair.token1)) edges.get(pair.token1)?.push(edge1);
          if (edges.has(pair.token2)) edges.get(pair.token2)?.push(edge2);
        }
      } else {
        // The query batch failed, continue to next batch
        console.log("BatchRequest failed for batch, continue to next batch");
        continue;
      }
    } else {
      console.log("No queries available for this batch");
      continue;
    }
  }

  // find all paths to ust, choose the path with best exchange rate
  for (const [key, node] of nodes) {
    // transform

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    node.price_ust = getExchangeRate(edges, node, nodes.get("uusd"));
    node.block_last_updated = height;
    // node.symbol
    // node.price_usd = 123
    // node.ust_usd
  }

  return nodes;
}

async function savePrices(prices: Map<string, PriceGraphNode>) {
  for (const [key, node] of prices) {
    if (node.price_ust == 0) continue;

    await PriceV2.updateOne(
      {
        token_address: node.token_address,
      },
      {
        $set: {
          token_address: node.token_address,
          price_ust: node.price_ust,
          block_last_updated: node.block_last_updated,
        },
      },
      { upsert: true }
    );
  }
}
