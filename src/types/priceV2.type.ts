export type PriceV2 = {
  token_address: string;
  price_usd: number;
  price_ust: number;
  ust_usd: number;
  is_external: boolean;
  symbol: string;
  source : {
    feed: string;
    category_id: string;
    name: string;
  }
  block_last_updated: number;
};
