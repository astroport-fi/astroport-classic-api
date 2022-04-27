import "dotenv/config";
import "dayjs";
import mongoose from "mongoose";
import { initHive, initLCD } from "../src/lib/terra";
import constants from "../src/environment/constants";

//setup any configuration that run before or after all tests

declare module "dayjs" {
  interface Dayjs {
    utc(): any;
  }
}

export const mochaHooks = {
  async beforeEach(): Promise<void> {
    await mongoose.connect(constants.MONGODB_URL);
    await initHive(constants.TERRA_HIVE_ENDPOINT);
    await initLCD(constants.TERRA_LCD_ENDPOINT, constants.TERRA_CHAIN_ID);
  },
};
