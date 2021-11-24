import bluebird from 'bluebird';
import mongoose, { NativeError } from 'mongoose';

import { initHive, initLCD } from '../lib/terra';
import {
  TERRA_MANTLE,
  TERRA_CHAIN_ID,
  TERRA_LCD,
  MONGODB_URL,
} from '../constants';
import { dailyCollect } from './dailyCollect';
import { hourlyCollect } from './hourlyCollect';
import { heightCollect } from './heightCollect';

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

function connectDatabase(): Promise<void> {
  // logger.info(`Connecting to database`);

  return new Promise((resolve, reject) => {
    if (MONGODB_URL == null) {
      reject();
      return;
    }

    mongoose.connect(MONGODB_URL, {}, (error: NativeError) => {
      if (error) {
        // logger.error(`Database Error: ${error}`);
        reject(error);
      } else {
        // logger.info('Database connected');
        resolve(undefined);
      }
    });

    mongoose.set('debug', false);
  });
}

export async function run(): Promise<string> {
  if (TERRA_MANTLE == null || TERRA_LCD == null || TERRA_CHAIN_ID == null) {
    throw new Error('Constants are missing');
  }

  await connectDatabase();
  await initHive(TERRA_MANTLE);
  await initLCD(TERRA_LCD, TERRA_CHAIN_ID);
  try {
    await heightCollect();
    await dailyCollect();
    // await hourlyCollect();
  } catch (e) {
    console.log('e', e);
  }

  return 'ok';
}
