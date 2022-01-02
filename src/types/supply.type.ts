export type Supply = {
  timestamp: Date
  metadata: {
    circulatingSupply: number;
    priceInUst: number;
    totalValueLockedUst: number;
    dayVolumeUst: number;
  }
};