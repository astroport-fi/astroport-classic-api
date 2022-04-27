import * as mongoose from "mongoose";
import constants from "../environment/constants";

mongoose.set("debug", true);
let cachedConnection: any = null;

export function initConnection() {
  console.log("connecting to mongo");

  if (constants.MONGODB_URL == null) {
    console.log("MONGODB_URL is undefined");
    return;
  }

  if (cachedConnection === null) {
    const options: mongoose.ConnectOptions = {};

    cachedConnection = mongoose.createConnection(constants.MONGODB_URL, options);
    console.log("connected to mongo");
    return Promise.resolve(cachedConnection);
  }

  console.log("using cached mongo");
  return Promise.resolve(cachedConnection);
}
