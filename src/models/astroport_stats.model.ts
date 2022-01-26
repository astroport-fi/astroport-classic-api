import { Schema, model } from 'mongoose';

const astroportStatSchema: Schema = new Schema(
  {
    total_liquidity: {
      type: Schema.Types.Number,
      required: true,
      trim: true
    },
    total_volume_24h: {
      type: Schema.Types.Number,
      required: true,
      trim: true
    },
    astro_price: {
      type: Schema.Types.Number,
      required: true,
      trim: true
    }
  }
);

export const AstroportStat = model('AstroportStat', astroportStatSchema, 'astroport_stats');
