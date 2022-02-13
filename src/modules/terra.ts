import { num } from '../lib/num';

export const isNative = (token: string): boolean => {
  return token.slice(0, 6) !== 'terra1';
};

export const isNativeToken = (token: any): boolean => {
  return 'native_token' in token;
};

export const getTokenDenom = (info: any) => {
  if (isNativeToken(info)) {
    return info.native_token.denom;
  }

  return info.token?.contract_addr;
};

export const getTokenAmount = (info: any) => {
  if (isNativeToken(info)) {
    return info.native_token.amount;
  }

  return info.token?.amount;
};

export const getAssetAmountsInPool = (pool: any, token: string) => {
  return pool.assets.reduce(
    (prev: any, a: any) => {
      const key = getTokenDenom(a.info) === token ? 'token1' : 'token2';

      return {
        ...prev,
        [key]: a.amount,
      };
    },
    { token1: '0', token2: '0' }
  );
};

export const getPricesFromPool = (pool: any, token: string) => {
  if (pool == null || token == null) {
    return {
      token1: 0,
      token2: 0,
    };
  }

  const { token1, token2 } = getAssetAmountsInPool(pool, token);

  return {
    token1: num(token2).div(token1).toFixed(6),
    token2: num(token1).div(token2).toFixed(6),
  };
};
