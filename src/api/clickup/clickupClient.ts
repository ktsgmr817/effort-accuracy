import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

const options = {
  ignoreHeaders: true,
};

// URLの共通部分を設定
export const clickupClient = applyCaseMiddleware(
  axios.create({
    baseURL: "https://api.clickup.com/api/v2/",
    headers: {
      "Content-Type": "application/json",
      Authorization: "pk_44288021_VOUHMRTZIW9ZQ6T8I81L75U9YX2FDYRS",
    },
  }),
  options
);
