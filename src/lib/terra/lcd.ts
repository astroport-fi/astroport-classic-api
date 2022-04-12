import { LCDClient } from "@terra-money/terra.js";

export let lcd: LCDClient;

export function initLCD(URL: string, chainID: string): LCDClient {
  lcd = new LCDClient({ URL, chainID, gasPrices: { uusd: 0.15 } });
  return lcd;
}

export const getPairMessages = async (tx: string) => {
  const txInfo = await lcd.tx.txInfo(tx);
  const data: any = txInfo?.tx?.body?.messages?.find(() => true)?.toData() || {};
  return data?.execute_msg;
};
