import mongoose from 'mongoose';

import { MONGODB_URL } from '../constants';

mongoose.Promise = global.Promise;
let isConnected: number;

export const connectToDatabase = (): Promise<void> => {
  if (MONGODB_URL == null) {
    return Promise.reject();
  }

  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  return mongoose.connect(MONGODB_URL).then((db) => {
    isConnected = db.connections[0].readyState;
  });
};
