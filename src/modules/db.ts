import mongoose, { Connection } from "mongoose";
import { MONGODB_URL } from "../constants";

if (!MONGODB_URL) {
  throw new Error("Please define the MONGODB_URL environment variable inside .env.local");
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: any;
}

/**
 * Global is used here to maintain a cached connection.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = (): Promise<void> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = cached.promise;
  return cached.conn;
};

mongoose.Promise = global.Promise;
let isConnected: number;

export const connectToDatabasev1 = (): Promise<void> => {
  if (MONGODB_URL == null) {
    return Promise.reject();
  }

  if (isConnected) {
    console.log("=> using existing database connection");
    return Promise.resolve();
  }

  console.log("=> using new database connection");
  return mongoose.connect(MONGODB_URL).then((db) => {
    isConnected = db.connections[0].readyState;
  });
};
