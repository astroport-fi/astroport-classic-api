/**
 * ProductionEnvironment defines constants to be used in production,
 * all values defined here will overwrite matching values in
 * DevelopmentEnvironment
 */
export class ProductionEnvironment {
  // Index signature to allow index access of properties
  // see https://basarat.gitbook.io/typescript/type-system/index-signatures#declaring-an-index-signature
  [index: string]: any;

  // Overwrite simple string
  SECOND_SIMPLE_STRING_VALUE: string = "Production second simple string";

  // Overwrite map
  MAP_VALUE = new Map<string, string>([
    ["terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs", "ANC"],
    ["terra1zpnhtf9h5s7ze2ewlqyer83sr4043qcq64zfc4", "APOLLO"],
    ["terra1testaddress", "TEST"],
  ]);

  // Overwrite complex type
  MORE_COMPLEX_TYPE = new Map<string, any>([
    ["cwbtc", { symbol: "CWBTC", name: "Compound Wrapped BTC (Prod)" }],
  ]);

  // Overwrite simple object
  SIMPLE_OBJECT: any = {
    value1: "test1+prod",
    value2: "test2",
  };
}
