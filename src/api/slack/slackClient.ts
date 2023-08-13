import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const options = {
  ignoreHeaders: true,
};

// URLの共通部分を設定
export const slackClient = applyCaseMiddleware(
  axios.create({
    baseURL: `${process.env.SLACK_WEBHOOK_URL}`,
    headers: {
      "Content-Type": "application/json",
    },
  }),
  options
);
