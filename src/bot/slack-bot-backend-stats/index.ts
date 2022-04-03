import bluebird from "bluebird";
import {
  APIGatewayAuthorizerResultContext,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { getLatestHeight, initLCD, initMantle } from "../../lib/terra";
import { TERRA_CHAIN_ID, TERRA_LCD } from "../../constants";

import { gql, GraphQLClient } from "graphql-request";
import axios from "axios";
import { generate_post_fields } from "./helpers";
import { get_ust_balance } from "./helpers";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

const DEV_URL = "https://2h8711jruf.execute-api.us-east-1.amazonaws.com/dev/graphql";
const PROD_URL = "https://api.astroport.fi/graphql";
const SLACK_WEBHOOK =
  "https://hooks.slack.com/services/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";

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
      keepalive: true,
    });

    await initMantle("https://mantle.terra.dev/graphql");
    await initLCD(TERRA_LCD, TERRA_CHAIN_ID);

    // blocks
    const devHeightRaw = await dev.request(
      gql`
        query {
          block {
            height
          }
        }
      `
    );
    const devHeight = devHeightRaw?.block?.height;
    const mantleHeight = await getLatestHeight();
    const prodHeightRaw = await prod.request(
      gql`
        query {
          block {
            height
          }
        }
      `
    );
    const prodHeight = prodHeightRaw?.block?.height;

    // stats
    const dayFeesRaw = await prod.request(
      gql`
        query {
          staking {
            _24h_fees_ust
          }
        }
      `
    );
    const dayFees = dayFeesRaw?.staking?._24h_fees_ust;

    // bots
    // maker bot address - mainnet
    const maker = "terra1lz4pz06aa3e5f70u2pcc3u754n847lk9cww05r"
    const gov = "terra1jy093k4nsyfma0q87mhsu3p08dc4fpt4zur7hr"
    const maker_bot_balance = await get_ust_balance(maker)
    const gov_bot_balance = await get_ust_balance(gov)

    let message = "```";
    message += "--------------------------\n";
    message += "|         Blocks         |\n";
    message += "--------------------------\n";

    message += "Realtime     : " + mantleHeight + "\n";
    message += "Dev          : " + devHeight + "\n";
    message += "Blocks behind: " + (mantleHeight - devHeight) + "\n";
    message +=
      "Hours behind : " + Math.round(((mantleHeight - devHeight) / 600) * 100) / 100 + "\n";
    message += "\n";
    message += "Realtime     : " + mantleHeight + "\n";
    message += "Prod         : " + prodHeight + "\n";
    message += "Blocks behind: " + (mantleHeight - prodHeight) + "\n";
    message +=
      "Hours behind : " + Math.round(((mantleHeight - prodHeight) / 600) * 100) / 100 + "\n\n";
    message += "--------------------------\n";
    message += "|          Stats         |\n";
    message += "--------------------------\n";
    message += "Fees 24h: " + dayFees + "\n\n";

    message += "--------------------------\n";
    message += "|       Bots (prod)      |\n";
    message += "--------------------------\n";

    message += "Maker Fee Bot - " + maker + "\n";
    message += "UST balance: " + maker_bot_balance + "\n";
    message += "Days left  : " + Math.round(maker_bot_balance / 16) + "\n\n"; // 1x per day

    message += "Gov State Bot - " + gov + "\n";
    message += "UST balance: " + gov_bot_balance + "\n";
    message += "Days left  : " + Math.round(gov_bot_balance / .30) + "\n"; // 2x per day
    message += "```";

    const post_fields = generate_post_fields(message);

    let config = {
      headers: {
        "Content-Type": "application/json",
        charset: "utf-8",
      },
    };

    await axios.post(SLACK_WEBHOOK, post_fields, config);
  } catch (e) {
    throw new Error("Error while running bots: " + e);
  }

  return {
    statusCode: 200,
    body: "Ran bots",
  };
}
