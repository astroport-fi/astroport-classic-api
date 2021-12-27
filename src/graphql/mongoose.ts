import * as mongoose from 'mongoose';

import { MONGODB_URL } from '../constants';

mongoose.set('debug', true);
let cachedConnection: any = null;

export function initConnection() {
  console.log('connecting to mongo');

  if (MONGODB_URL == null) {
    console.log('MONGODB_URL is undefined');
    return;
  }

  if (cachedConnection === null) {
    let options: mongoose.ConnectOptions = {};

    cachedConnection = mongoose.createConnection(MONGODB_URL, options);
    console.log('connected to mongo');
    return Promise.resolve(cachedConnection);
  }

  console.log('using cached mongo');
  return Promise.resolve(cachedConnection);
}
