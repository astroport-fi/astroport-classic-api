import constants from "../environment/constants";
import { num } from "../lib/num";
import { getStableswapRelativePrice } from "../lib/terra";

export const isNative = (token: string): boolean => {
  return token.slice(0, 6) !== "terra1" && token.slice(0, 3) !== "ibc";
};

export const isIBCToken = (token: string): boolean => {
  return token.slice(0, 3) === "ibc";
};

export const isNativeToken = (token: any): boolean => {
  return "native_token" in token;
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
      const key = getTokenDenom(a.info) === token ? "token1" : "token2";

      return {
        ...prev,
        [key]: a.amount,
      };
    },
    { token1: 0, token2: 0 }
  );
};

export const getPricesFromPool = async (
  pool: any,
  pool_address: string,
  token_1_address: string,
  _token_2_address: string,
  pool_type: string
) => {
  if (pool == null || token_1_address == null) {
    return {
      token1: 0,
      token2: 0,
    };
  }

  const { token1, token2 } = getAssetAmountsInPool(pool, token_1_address);

  if (pool_type == "stable") {
    const amount = constants.TOKENS_WITH_8_DIGITS.has(token_1_address) ? 100000000 : 1000000;

    let token1_price = await getStableswapRelativePrice(
      pool_address,
      token_1_address,
      String(amount)
    );

    if (constants.TOKENS_WITH_8_DIGITS.has(token1)) {
      token1_price *= 100;
    }

    // TODO test with 0, 1, 2 tokens with 8 digits

    const token2_price = 1000000 / token1_price;
    token1_price /= 1000000;

    return {
      token1: token1_price,
      token2: token2_price,
    };
  } else {
    // xyk

    // TODO test for when both tokens have 8 decimals
    if (constants.TOKENS_WITH_8_DIGITS.has(token_1_address)) {
      const _f1 = num(token2).div(token1).multipliedBy(100).toFixed(6);
      const _f2 = num(token1).div(token2).div(100).toFixed(6);
      return {
        token1: num(token2).div(token1).multipliedBy(100).toFixed(6),
        token2: num(token1).div(token2).div(100).toFixed(6),
      };
    }

    return {
      token1: num(token2).div(token1).toFixed(6),
      token2: num(token1).div(token2).toFixed(6),
    };
  }
};
