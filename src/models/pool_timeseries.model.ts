import { Schema, model } from 'mongoose';

const poolTimeseriesSchema: Schema = new Schema(
  {
    timestamp: {
      type: Schema.Types.Date,
      required: false,
      trim: true
    },
    metadata: {
      pool_address: {
        type: Schema.Types.String,
        required: false,
        trim: true
      },
      lp_address: {
        type: Schema.Types.String,
        required: false,
        trim: true
      },
      trading_fee_rate_bp: {
        type: Schema.Types.Number,
        required: false,
        trim: true
      },
      pool_liquidity: {
        type: Schema.Types.Number,
        required: false,
        trim: true
      },
      day_volume_ust: {
        type: Schema.Types.Number,
        required: false,
        trim: true
      },
      token_symbol: {
        type: Schema.Types.String,
        required: false,
        trim: true
      },
      prices: {
        token1_symbol: {
          type: Schema.Types.String,
          required: false,
          trim: true
        },
        token1_price_ust: {
          type: Schema.Types.Number,
          required: false,
          trim: true
        },
        token2_symbol: {
          type: Schema.Types.String,
          required: false,
          trim: true
        },
        token2_price_ust: {
          type: Schema.Types.Number,
          required: false,
          trim: true
        },
      },
      fees: {
        trading: {
          day: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          },
          apr: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          },
          apy: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          }
        },
        astro: {
          day: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          },
          apr: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          },
          apy: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          }
        },
        native: {
          day: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          },
          apr: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          },
          apy: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          }
        },
        total: {
          day: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          },
          apr: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          },
          apy: {
            type: Schema.Types.Number,
            required: false,
            trim: true
          }
        }
      }
    }
  }
);

export const PoolTimeseries = model('PoolTimeseries', poolTimeseriesSchema, 'pool_timeseries');
