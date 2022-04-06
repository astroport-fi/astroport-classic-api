export function generate_post_fields(text: string) {
  const post_fields = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: text
        },
      },
    ],
  };

  return post_fields;
}

export function generate_link_to_txn(txnhash: string) {

  const link = "https://legacy.extraterrestrial.money/mainnet/tx/" + txnhash
  const post_fields = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Maker bot executed a buyback",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "<" + link + "| " + txnhash + ">",
        },
      },
    ],
  };

  return post_fields;
}
