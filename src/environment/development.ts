/**
 * DevelopmentEnvironment defines constants to be used as the base setup,
 * specifically for development
 */
export class DevelopmentEnvironment {
  SIMPLE_STRING_VALUE: string = "Development simple string";
  SECOND_SIMPLE_STRING_VALUE: string = "Development second simple string";

  DECIMALS = process.env.DECIMALS;
  MONGODB_URL = process.env.MONGODB_URL;

  MAP_VALUE = new Map<string, string>([
    ["terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs", "ANC"],
    ["terra1zpnhtf9h5s7ze2ewlqyer83sr4043qcq64zfc4", "APOLLO"],
  ]);

  MORE_COMPLEX_TYPE = new Map<string, any>([
    ["cusdc", { symbol: "CUSDC", name: "Compound USD Coin" }],
    ["cwbtc", { symbol: "CWBTC", name: "Compound Wrapped BTC" }],
    ["inj", { symbol: "INJ", name: "INJ" }],
  ]);

  SIMPLE_OBJECT: any = {
    value1: "test1",
    value2: "test2",
  };
}
