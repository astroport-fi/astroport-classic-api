import { Token } from "../models";
import { TokenInfo } from "../types/hive.type";
import { isIBCToken, isNative } from "../modules/terra";
import { getIBCDenom, initLCD } from "../lib/terra";
import { IBC_DENOM_MAP, TERRA_CHAIN_ID, TERRA_LCD } from "../constants";

export async function getTokens(): Promise<any[]> {
  const tokens = await Token.find();
  return tokens;
}

export async function getToken(tokenAddr: string): Promise<any> {
  const token = await Token.findOne({ tokenAddr });
  return token;
}

export async function createToken(tokenInfo: TokenInfo): Promise<any> {
  if (isNative(tokenInfo.address)) {
    const options = {
      tokenAddr: tokenInfo.address,
      symbol: tokenInfo.address,
      icon: "",
      decimals: 6,
    };

    try {
      const token = await Token.create(options);
      return token;
    } catch (e) {
      console.log(e);
    }
  }
  if (isIBCToken(tokenInfo.address)) {
    initLCD(TERRA_LCD, TERRA_CHAIN_ID);
    const denom = await getIBCDenom(tokenInfo.address);

    const options = {
      tokenAddr: tokenInfo.address,
      name: IBC_DENOM_MAP.get(denom)?.name || denom,
      symbol: IBC_DENOM_MAP.get(denom)?.symbol || tokenInfo.address,
      icon: "",
      decimals: 6,
    };

    try {
      const token = await Token.create(options);
      return token;
    } catch (e) {
      console.log(e);
    }
  }

  const options = {
    tokenAddr: tokenInfo.address,
    symbol: tokenInfo?.symbol || tokenInfo.address,
    decimals: tokenInfo?.decimals || 0,
    name: tokenInfo?.name || "",
    icon: "",
  };

  try {
    const token = await Token.create(options);
    return token;
  } catch (e) {
    console.log(e);
  }
}
