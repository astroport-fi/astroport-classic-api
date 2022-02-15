import { PriceGraphNode } from "./price_graph_node";

export class PriceGraphEdge {
  from: PriceGraphNode;
  to: PriceGraphNode;
  exchangeRate: number;
  pool_liquidity_ust: number;
  _24h_volume_ust: number;
  source: string;
}
