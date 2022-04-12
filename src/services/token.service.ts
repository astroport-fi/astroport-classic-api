import { Token } from "../models";
import { isNative } from "../modules/terra";
import { getTokenInfo } from "../lib/terra";
import { TokenInfo } from "../types/hive.type";

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
