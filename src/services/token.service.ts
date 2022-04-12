import { Token } from "../models";
import { isIBCToken, isNative } from "../modules/terra";
import { getIBCDenom, getTokenInfo, initLCD } from "../lib/terra";
import { IBC_DENOM_MAP, TERRA_CHAIN_ID, TERRA_LCD } from "../constants";

export async function getTokens(): Promise<any[]> {
  const tokens = await Token.find();
  return tokens;
}

export async function getToken(tokenAddr: string): Promise<any> {
  const token = await Token.findOne({ tokenAddr });
  return token;
}

export async function createToken(tokenAddr: string): Promise<any> {
  if (isNative(tokenAddr)) {
    const options = {
      tokenAddr: tokenAddr,
      symbol: tokenAddr,
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
  if (isIBCToken(tokenAddr)) {
    initLCD(TERRA_LCD, TERRA_CHAIN_ID);
    const denom = await getIBCDenom(tokenAddr);

    const options = {
      tokenAddr: tokenAddr,
      name: IBC_DENOM_MAP.get(denom)?.name || denom,
      symbol: IBC_DENOM_MAP.get(denom)?.symbol || tokenAddr,
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

  const response = await getTokenInfo(tokenAddr);

  const options = {
    tokenAddr: tokenAddr,
    symbol: response?.symbol || tokenAddr,
    decimals: response?.decimals || 0,
    name: response?.name || "",
    icon: "",
  };

  try {
    const token = await Token.create(options);
    return token;
  } catch (e) {
    console.log(e);
  }
}
