
// get ust amount of wallet
import axios from "axios";

export async function get_ust_balance(wallet: string): Promise<any> {
  const url =
    "https://lcd.terra.dev/cosmos/bank/v1beta1/balances/" + wallet + "/by_denom?denom=uusd";

  const data = await axios.get(url).then((response) => response.data);

  const ust_raw = data["balance"]["amount"] as number;
  return  Math.round((ust_raw / 1000000) * 100) / 100;

}

// for slack
export function generate_post_fields(text: string) {
  const post_fields = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: text,
        },
      },
    ],
  };

  return post_fields;
}
