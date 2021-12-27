import { Token } from '../models';
import { isNative } from '../modules/terra';
import { getTokenInfo } from '../lib/terra';

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
      icon: '',
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

  let options = {
    tokenAddr: tokenAddr,
    symbol: response?.symbol || tokenAddr,
    decimals: response?.decimals || 0,
    icon: '',
  };

  try {
    const token = await Token.create(options);
    return token;
  } catch (e) {
    console.log(e);
  }
}
