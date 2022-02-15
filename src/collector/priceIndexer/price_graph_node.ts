export class PriceGraphNode {
  token_address: string;
  price_in_usd: number;
  price_in_ust: number;
  ust_usd: number;
  is_external: boolean;
  symbol: string;
  source : {
    feed: string;
    category_id: string;
    name: string;
  }
  block_last_updated: number;
}