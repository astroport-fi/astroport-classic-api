import "dotenv/config";
import "dayjs";
import mongoose from "mongoose";
import { initHive, initMantle } from "../src/lib/terra";
import { MONGODB_URL, TERRA_HIVE, TERRA_MANTLE } from "../src/constants";

//setup any configuration that run before or after all tests

declare module "dayjs" {
  interface Dayjs {
    utc(): any;
  }
}

export const mochaHooks = {
  async beforeEach(): Promise<void> {
    await mongoose.connect(MONGODB_URL);
    await initHive(TERRA_HIVE);
    await initMantle(TERRA_MANTLE);
  },
};
