import { Pair } from "../../types";
import { PriceGraphEdge } from "./price_graph_edge";
import { PriceGraphNode } from "./price_graph_node";
import { Queue } from "./Queue";

/**
 * Return the exchange rate between the two pairs.
 * Uses BFS with the visited set of nodes in the queue.
 *
 * @param edges - price graph
 * @param start - start node
 * @param end - end node
 */
export function getExchangeRate(
  edges: Map<string, PriceGraphEdge[]>,
  start: PriceGraphNode,
  end: PriceGraphNode
): number {
  if (start == null || end == null) {
    return 0;
  }

  // this represents the best exchange rate we can get for a path
  // we are trying to maximize this because this represents the most efficient path
  let maxExchangeRate = 0;

  const queue = new Queue();
  queue.push({
    node: start,
    exchangeRate: 1,
    visited: new Set<string>([start.token_address]),
  });

  while (!queue.isEmpty()) {
    const curr = queue.pop();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const curr_address = curr?.node?.token_address;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const curr_exchange_rate = curr.exchangeRate as number;

    if (curr_address == null || curr_exchange_rate == null) continue;

    // if we found a route, mark it as the best route if it has the best (highest) price
    if (curr_address == end.token_address) {
      maxExchangeRate = Math.max(maxExchangeRate, curr_exchange_rate);
    }

    // add neighbors to queue
    if (edges.has(curr_address)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      for (const edge of edges.get(curr_address)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const newVisited = curr.visited;
        newVisited.add(curr_address);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!curr.visited.has(edge.to.token_address)) {
          queue.push({
            node: edge.to,
            exchangeRate: edge.exchangeRate * curr_exchange_rate,
            visited: newVisited,
          });
        }
      }
    }
  }

  return maxExchangeRate;
}

/**
 * batchItems batches items of type T into batchSize chunks
 *
 * @param items The items to split into chunks
 * @param pairBatchSize The maximum size of each chunk
 * @returns The batches
 */
export const batchItems = <T>(items: T[], batchSize: number = 10) =>
  items.reduce((batches: T[][], item: T, index) => {
    const batch = Math.floor(index / batchSize);
    batches[batch] = ([] as T[]).concat(batches[batch] || [], item);
    return batches;
  }, []);
