import assert from "assert";
import {
  getTxBlock,
  initHive,
  initMantle
} from "../../../src/lib/terra";


import { runIndexers } from "../../../src/collector/chainIndexer";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getPairs } from "../../../src/services";
import mongoose from "mongoose";
import { pairListToMap } from "../../../src/collector/helpers";
dayjs.extend(utc);

const MONGODB_URL = ""


describe('Chain collect tests', function() {
  describe('Listen for Astro swap', function() {
    it('should add pair to database', async function() {

      // database
      await mongoose.connect(MONGODB_URL);

      await initHive("https://hive.terra.dev/graphql");
      await initMantle("https://mantle.terra.dev/graphql")

      const pairs = await getPairs();
      const pairMap = await pairListToMap(pairs);

      const block = await getTxBlock(5979042) // 2 swaps
      await runIndexers(block, pairMap);


    });
  });

  describe('Listen for Astro multi hop swap', function() {
    it('should add pair to database', async function() {

      // database
      await mongoose.connect(MONGODB_URL);

      await initHive("https://hive.terra.dev/graphql");
      await initMantle("https://mantle.terra.dev/graphql")

      const pairs = await getPairs();
      const pairMap = await pairListToMap(pairs);

      const block = await getTxBlock(5979042) // TODO
      await runIndexers(block, pairMap);


    });
  });

  describe('Listen for Astro non UST swap', function() {
    it('should correctly calculate volume', async function() {

      // database
      await mongoose.connect(MONGODB_URL);

      await initHive("https://hive.terra.dev/graphql");
      await initMantle("https://mantle.terra.dev/graphql")

      const pairs = await getPairs();
      const pairMap = await pairListToMap(pairs);

      const block = await getTxBlock(5979042) // TODO
      await runIndexers(block, pairMap);


    });
  });

  describe('Listen for Astro create_pair', function() {
    it('should add pair to database', async function() {

      // database
      await mongoose.connect(MONGODB_URL);

      await initHive("https://hive.terra.dev/graphql");
      await initMantle("https://mantle.terra.dev/graphql")

      const pairs = await getPairs();
      const pairMap = await pairListToMap(pairs);

      const block = await getTxBlock(5848466) // ASTRO-UST create pair
      await runIndexers(block, pairMap);


    });
  });

  // TODO
  describe('Listen for astro deregister', function() {
    it('should update pair property to be deregistered', async function() {

      // database
      await mongoose.connect(MONGODB_URL);

      await initHive("https://hive.terra.dev/graphql");
      await initMantle("https://mantle.terra.dev/graphql")

      const pairs = await getPairs();
      const pairMap = await pairListToMap(pairs);

      const block = await getTxBlock(5979042) // TODO need a sample register
      await runIndexers(block, pairMap);


    });
  });
});