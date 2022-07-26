import bluebird from "bluebird";
import { getLatestBlock } from "../../lib/terra";

import { gql, GraphQLClient } from "graphql-request";
import axios from "axios";
import { generate_post_fields } from "./slackHelpers";
import { get_ust_balance } from "./helpers";
import { lambdaHandlerWrapper } from "../../lib/handler-wrapper";
import constants from "environment/constants";

bluebird.config({
  longStackTraces: true,
  warnings: { wForgottenReturn: false },
});
global.Promise = bluebird as any;

const PROD_URL = "https://terra1-api.astroport.fi/graphql";
const SLACK_WEBHOOK =
  "https://hooks.slack.com/services/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";

export const run = lambdaHandlerWrapper(
  async (): Promise<void> => {
    const prod = new GraphQLClient(PROD_URL, {
      timeout: 5000,
      keepalive: true,
    });

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
    const latestProdHeight = (await getLatestBlock()).height;
    const dayFees = dayFeesRaw?.staking?._24h_fees_ust;

    // bots
    // maker bot address - mainnet
    const maker = constants.MAKER_FEE_COLLECTOR_ADDRESS;
    const maker_bot_balance = await get_ust_balance(maker);
    // maker bot address - mainnet
    const gov = constants.GOVERNANCE_TRIGGER_ADDRESS;
    const gov_bot_balance = await get_ust_balance(gov);

    let message = "```";
    message += "--------------------------\n";
    message += "|         Terra-1        |\n";
    message += "--------------------------\n";
    message += "|         Blocks         |\n";
    message += "--------------------------\n";
    message += "\n";
    message += "Realtime     : " + latestProdHeight + "\n";
    message += "Prod         : " + prodHeight + "\n";
    message += "Blocks behind: " + (latestProdHeight - prodHeight) + "\n";
    message +=
      "Hours behind : " + Math.round(((latestProdHeight - prodHeight) / 600) * 100) / 100 + "\n\n";
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
    message += "Days left  : " + Math.round(gov_bot_balance / 0.3) + "\n"; // 2x per day
    message += "```";

    const post_fields = generate_post_fields(message);

    const config = {
      headers: {
        "Content-Type": "application/json",
        charset: "utf-8",
      },
    };

    await axios.post(SLACK_WEBHOOK, post_fields, config);
  },
  {
    errorMessage: "Error while running slack-bot-backend-stats: ",
    successMessage: "Ran bots",
  }
);
