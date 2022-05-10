import { Token } from "../models";
import { TokenInfo } from "../types/hive.type";
import { captureFunctionException } from "../lib/error-handlers";

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
    await captureFunctionException(e, {
      name: "token.service.ts/createToken",
    });
  }
}
