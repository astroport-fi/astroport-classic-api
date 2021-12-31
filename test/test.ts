import { initHive, initLCD } from '../src/lib/terra';

import { connectToDatabase } from '../src/modules/db';
import * as assert from "assert";
import { supplyCollect } from "../src/collector/supplyCollect";
import { insertSupply } from "../src/services";
import { Supply } from "../src/models/supply.model";
import dayjs from 'dayjs';
import mongoose from "mongoose";



describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', async function() {


      // write to supply table
      const timestamp = dayjs().valueOf();

      // const s = Supply.find().sort({ _id: 1 }).limit(1)


      const s = await Supply.findOne({}).sort({timestamp: 'desc'}).exec();

      // const s = Supply.create(
      //   {
      //     timestamp: timestamp,
      //     metadata:
      //       {
      //         circulatingSupply: 12,
      //         priceInUst: 12,
      //         totalValueLockedUst: undefined,
      //         dayVolumeUst: undefined,
      //
      //       }
      //   });
      assert.equal(s, "");
    });
  });
});
