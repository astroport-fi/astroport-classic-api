import bluebird from "bluebird";
import { APIGatewayAuthorizerResultContext, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { connectToDatabase } from "../../modules/db";
import { initHive, initLCD, initMantle } from "../../lib/terra";
import { getPairs } from "../../services";
import { pairListToMap, priceListToMap } from "../../collector/helpers";
import { getPrices } from "../../services/priceV2.service";
import { heightCollect } from "./heightCollect";
import { chainCollect } from "./chainCollect";



bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

export async function run(
  _: APIGatewayProxyEvent,
  context: APIGatewayAuthorizerResultContext
): Promise<APIGatewayProxyResult> {


  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase();
  await initHive("https://testnet-hive.terra.dev/graphql");
  await initMantle("https://bombay-mantle.terra.dev/");
  await initLCD("https://bombay-lcd.terra.dev", "bombay-12");

  // get pairs
  // map contract_address -> pair
  const pairs = await getPairs();
  const pairMap = pairListToMap(pairs);

  const prices = await getPrices();
  const priceMap = priceListToMap(prices);

  try {

    const start = new Date().getTime()

    console.log("Indexing testnet height...")
    await heightCollect();

    // votes
    console.log("Indexing testnet chain...")
    await chainCollect(pairMap, priceMap);

    console.log("Total time elapsed: " + (new Date().getTime() - start) / 1000)

  } catch (e) {
    throw new Error("Error while running indexer: " + e);
  }

  return {
    statusCode: 200,
    body: 'collected',
  };
}
