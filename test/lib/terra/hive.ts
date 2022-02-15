import mongoose from "mongoose";
import { getPairLiquidity, initHive, initMantle } from "../../../src/lib/terra";
import { MONGODB_URL } from "../../../src/constants";
import { PriceV2 } from "../../../src/models/price_v2.model";

describe('Protocol rewards collector test', function() {

  beforeEach(async function() {
    await mongoose.connect(MONGODB_URL);
    await initHive("https://hive.terra.dev/graphql");
    await initMantle("https://mantle.terra.dev/graphql")
  });

  describe('Get pair liquidity for 2 native tokens', function() {
    it('Should return liquidity for UST/LUNA', async function() {

      const pair = "terra1m6ywlgn6wrjuagcmmezzz2a029gtldhey5k552"
      const pricesRaw = await PriceV2.find()
      const priceMap = new Map(pricesRaw.map(price => [price.token_address, price]))

      const result = await getPairLiquidity(pair, JSON.parse('{ "pool": {} }'), priceMap);
      console.log(result)
    });
  });

  describe('Get pair liquidity for stableswap', function() {
    it('Should return liquidity for bLuna/Luna', async function() {

      const pair = "terra1j66jatn3k50hjtg2xemnjm8s7y8dws9xqa5y8w"
      const pricesRaw = await PriceV2.find()
      const priceMap = new Map(pricesRaw.map(price => [price.token_address, price]))

      const result = await getPairLiquidity(pair, JSON.parse('{ "pool": {} }'), priceMap);
      console.log(result)
    });
  });

  describe('Get pair liquidity for CW20/Native', function() {
    it('Should return liquidity for ANC/UST', async function() {

      const pair = "terra1qr2k6yjjd5p2kaewqvg93ag74k6gyjr7re37fs"
      const pricesRaw = await PriceV2.find()
      const priceMap = new Map(pricesRaw.map(price => [price.token_address, price]))

      const result = await getPairLiquidity(pair, JSON.parse('{ "pool": {} }'), priceMap);
      console.log(result)
    });
  });

  describe('Get pair liquidity for CW20/CW20', function() {
    it('Should return liquidity for nLuna/Psi', async function() {

      const pair = "terra10lv5wz84kpwxys7jeqkfxx299drs3vnw0lj8mz"
      const pricesRaw = await PriceV2.find()
      const priceMap = new Map(pricesRaw.map(price => [price.token_address, price]))

      const result = await getPairLiquidity(pair, JSON.parse('{ "pool": {} }'), priceMap);
      console.log(result)
    });
  });
});