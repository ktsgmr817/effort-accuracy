import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const options = {
  ignoreHeaders: true,
};

// URLの共通部分を設定
export const clickupClient = applyCaseMiddleware(
  axios.create({
    baseURL: `${process.env.CLICKUP_URL}/api/v2/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.CLICKUP_API_TOKEN,
    },
  }),
  options
);
