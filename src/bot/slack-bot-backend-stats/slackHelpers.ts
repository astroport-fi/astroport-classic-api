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
