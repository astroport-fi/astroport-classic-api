import { Pair } from "../../types";
import { PriceGraphNode } from "./price_graph_node";
import { PriceGraphEdge } from "./price_graph_edge";
import { getBlock } from "../../services";
import { getPricesFromPool } from "../../modules/terra";
import { getPool } from "../../lib/terra";
import { getExchangeRate } from "./util";
import { PriceV2 } from "../../models/price_v2.model";
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
export async function indexPrices(pairs: Pair[], height = 0): Promise<Map<string, PriceGraphNode>> {
  // map token addresses to nodes
  const nodes = new Map<string, PriceGraphNode>();
  // adjacency list - maps token address to a node's edges
  const edges = new Map<string, PriceGraphEdge[]>();

  // add nodes (tokens)
  for (const pair of pairs) {
    if (pair.deregistered) continue;

    for (const token of [pair.token1, pair.token2]) {
      const node = new PriceGraphNode();

      if (nodes.has(token)) continue;

      node.token_address = token;
      node.is_external = false;

      nodes.set(node.token_address, node);
      edges.set(node.token_address, []);
    }
  }

  // add price (edges)
  for (const pair of pairs) {
    // TODO remove after batching
    if (!constants.PAIRS_WHITELIST.has(pair.contractAddr)) {
      continue;
    }

    // TODO this query takes too long, especially for 145 pairs
    // TODO Start saving pool token amounts in DB
    // TODO and batch querying
    const data = await getPool(pair.contractAddr, height);
    if (data == null) continue;

    const { pool, time } = data;

    const pool_type: string = pair.type;

    const prices = await getPricesFromPool(
      pool,
      pair.contractAddr,
      pair.token1,
      pair.token2,
      pool_type
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
