import mongoose from "mongoose";
import { MONGODB_URL } from "../constants";

// mongoose.Promise = global.Promise;
// let isConnected: number;
// let database: typeof mongoose;

// export const connectToDatabase = (): Promise<void> => {
//   if (MONGODB_URL == null) {
//     return Promise.reject();
//   }

//   if (isConnected) {
//     console.log("=> using existing database connection");
//     return Promise.resolve();
//   }

//   console.log("=> using new database connection");
//   return mongoose.connect(MONGODB_URL).then((db) => {
//     database = db;
//     isConnected = db.connections[0].readyState;
//   });
// };

// export const disconnectDatabase = async (): Promise<void> => {
//   console.log("=> disconnecting database");
//   await database.connection.close();
// };

if (!MONGODB_URL) {
  throw new Error("Please define the MONGODB_URL environment variable inside .env");
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: any;
}

/**
 * Global is used here to maintain a cached connection.
 */
let cached = global.mongoose;
let db: typeof mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async (): Promise<void> => {
  if (cached.conn) {
    console.log("=> using existing database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    console.log("=> using new database connection");

    cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
      db = mongoose;
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export const disconnectDatabase = async (): Promise<void> => {
  console.log("=> disconnecting database");
  await db.connection.close();
};
