import axios from "axios";

export const WEBHOOK_URL =
  "https://hooks.slack.com/services/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";

interface PostFields {
  intro: string;
  title: string;
  link: string;
  wallet_link?: string;
  description?: string;
}
export function generate_post_fields({
  intro,
  title,
  link,
  wallet_link,
  description,
}: PostFields): any {
  let title_or_link = title;

  if (link != null) {
    title_or_link = "<" + link + "|" + title + " >";
  }

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: intro,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: title_or_link,
      },
      accessory: {
        type: "image",
        image_url: "https://astroport.fi/home.jpg",
        alt_text: "Pepe",
      },
    },
  ];

  if (wallet_link) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "<" + wallet_link + "| Submitted from this address>",
      },
    });
  }

  if (description) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: description,
      },
    });
  }

  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: "\n\n\n\n",
    },
  });

  return { blocks };
}

export async function notifySlack({
  intro,
  wallet_link,
  title,
  description,
  link,
}: PostFields): Promise<void> {
  const post_fields = generate_post_fields({ intro, wallet_link, title, description, link });

  const config = {
    headers: {
      "Content-Type": "application/json",
      charset: "utf-8",
    },
  };

  await axios.post(WEBHOOK_URL, post_fields, config);
}
