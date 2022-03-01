import bluebird from "bluebird";
import { APIGatewayAuthorizerResultContext, APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { getLatestHeight, initHive, initLCD, initMantle } from "../lib/terra";
import { TERRA_CHAIN_ID, TERRA_HIVE, TERRA_LCD, TERRA_MANTLE } from "../constants";

import { gql, GraphQLClient } from "graphql-request";
import axios from "axios";
import { generate_post_fields } from "./slackHelpers";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

const DEV_URL = "https://2h8711jruf.execute-api.us-east-1.amazonaws.com/dev/graphql"
const PROD_URL = "https://api.astroport.fi/graphql"
const SLACK_WEBHOOK = "https://hooks.slack.com/services/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"



export async function run(
  _: APIGatewayProxyEvent,
  context: APIGatewayAuthorizerResultContext
): Promise<APIGatewayProxyResult> {

  context.callbackWaitsForEmptyEventLoop = false;

  try {

    const dev = new GraphQLClient(DEV_URL, {
      timeout: 5000,
      keepalive: true,
    });
    const prod = new GraphQLClient(PROD_URL, {
      timeout: 5000,
      keepalive: true
    })

    await initMantle("https://mantle.terra.dev/graphql")
    await initLCD(TERRA_LCD, TERRA_CHAIN_ID);

    
    const devHeightRaw = await dev.request(gql`query { block { height } }`)
    const devHeight = devHeightRaw?.block?.height
    const mantleHeight = await getLatestHeight()
    // TODO enable after deployment
    // const prodHeightRaw = await prod.request(gql`query { block { height } }`)
    // const prodHeight = prodHeightRaw?.data?.block?.height

    // maker bot address - mainnet
    const wallet = "terra1lz4pz06aa3e5f70u2pcc3u754n847lk9cww05r"
    const url = "https://lcd.terra.dev/cosmos/bank/v1beta1/balances/" + wallet + "/by_denom?denom=uusd"

    const data = await axios
      .get(url)
      .then((response) =>  response.data)

    const ust_raw = data["balance"]["amount"] as number
    const ust_rounded = Math.round((ust_raw / 1000000) * 100) / 100
    const daily_gas = 1


    let message = "```"
    message += "--------------------------\n"
    message += "|         Blocks         |\n"
    message += "--------------------------\n"

    message += "Realtime     : " + mantleHeight + "\n"
    message += "Dev          : " + devHeight + "\n"
    message += "Blocks behind: " + (mantleHeight - devHeight) + "\n"
    message += "Hours behind : " + Math.round((mantleHeight - devHeight) / 600 * 100) / 100 + "\n"
    message += "---------------------\n"
    // console.log("Realtime      : " + mantleHeight)
    // console.log("Prod          : " + prodHeight)
    // console.log("Blocks behind : " + (mantleHeight - prodHeight))
    // console.log("Hours behind  : " + Math.round((mantleHeight - prodHeight) / 600 * 100) / 100)

    message += "--------------------------\n"
    message += "|          Bots          |\n"
    message += "--------------------------\n"

    message += "Maker Fee Swapper\n"
    message += "UST balance: " + ust_rounded + "\n"
    message += "Days left  : " + Math.round(ust_rounded / daily_gas) + "\n"
    message += "```"

    const post_fields = generate_post_fields(message)

    let config = {
      headers: {
        'Content-Type': 'application/json',
        'charset': 'utf-8'
      }
    }

    await axios.post(SLACK_WEBHOOK, post_fields, config)

  } catch (e) {
    throw new Error("Error while running bots: " + e);
  }

  return {
    statusCode: 200,
    body: 'Ran bots',
  };
}
