import * as mongoose from 'mongoose';

import { MONGODB_URL } from '../constants';
import * as fs from "fs";

mongoose.set('debug', true);
let cachedConnection: any = null;

export function initConnection() {
  console.log('connecting to mongo');

  if (cachedConnection === null) {
    let options: mongoose.ConnectOptions = {}
    options.sslCA = `${__dirname}/rds-combined-ca-bundle.pem`;

    cachedConnection = mongoose.createConnection(MONGODB_URL, options);
    console.log('connected to mongo');
    return Promise.resolve(cachedConnection);
  }

  console.log('using cached mongo');
  return Promise.resolve(cachedConnection);
}
