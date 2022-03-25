export function generate_post_fields(
  intro: string,
  wallet_link: string,
  title: string,
  description: string,
  link: string
) {
  let title_or_link = title;

  if (link != null) {
    title_or_link = "<" + link + "|" + title + " >";
  }

  const post_fields = {
    blocks: [
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
          text: "<" + wallet_link + "| Submitted from this address>",
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
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: description,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "\n\n\n\n",
        },
      },
    ],
  };
  return post_fields;
}
