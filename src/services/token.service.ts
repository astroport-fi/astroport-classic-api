import { Token } from "../models";
import { TokenInfo } from "../types/hive.type";
import { isIBCToken, isNative } from "../modules/terra";
import { getIBCDenom, getTokenInfo, initLCD } from "../lib/terra";
import constants from "../environment/constants";

export async function getTokens(): Promise<any[]> {
  const tokens = await Token.find();
  return tokens;
}

export async function getToken(tokenAddr: string): Promise<any> {
  const token = await Token.findOne({ tokenAddr });
  return token;
}

export async function createToken(tokenInfo: TokenInfo): Promise<any> {
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

export async function getTokenOrCreate(tokenAddr: string): Promise<any> {
  const token = await Token.findOne({ tokenAddr });
  if (token) {
    return token;
  }
  try {
    const tokenInfo = await getTokenInfo(tokenAddr);
    if (tokenInfo) {
      const token = await createToken(tokenInfo);
      // const token = tokenInfo;
      return token;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}
