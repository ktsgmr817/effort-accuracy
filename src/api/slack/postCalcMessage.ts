import {
  TParentTaskCalcurated,
  TSubtaskCalcurated,
} from "../../calcParentAccuracy";
import { slackClient } from "./slackClient";

const formatMilliSeconds = (miliSec: number) => {
  const sec = miliSec / 1000;
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = Math.floor(sec % 60);
  console.log(hours, minutes, seconds);
  return `${hours.toString().padStart(2, "0")}h${minutes
    .toString()
    .padStart(2, "0")}m${seconds.toString().padStart(2, "0")}s`;
};

const createSubtasksMessage = (subtasks: TSubtaskCalcurated[]) => {
  const sortedSubtask = subtasks.sort(
    (left, right) => left.index - right.index
  );
  return sortedSubtask.map((subtask) => {
    return {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${subtask.name}*\n想定工数 ：\t\t\t\t${formatMilliSeconds(
          subtask.timeEstimate
        )}\n実績工数 ：\t\t\t\t${formatMilliSeconds(
          subtask.duration
        )}\n見積もり誤差 ：\t\t±${Math.round(subtask.accuracy * 10) / 10} %\n`,
      },
    };
  });
};

const createMessage = (calcuratedTask: TParentTaskCalcurated) => {
  const subtasksMessage = createSubtasksMessage(calcuratedTask.subtasks);
  return {
    channel: "#times_sugimori",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "⭐工数見積精度 計算結果⭐",
          emoji: true,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*タスク名* ：\t\t\t\t${
            calcuratedTask.name
          }\n *想定工数* ：\t\t\t\t${formatMilliSeconds(
            calcuratedTask.timeEstimate
          )}\n *実績工数* ：\t\t\t\t${formatMilliSeconds(
            calcuratedTask.duration
          )}\n*見積もり誤差* ：\t\t±${calcuratedTask.accuracy} %\n`,
        },
      },
      {
        type: "divider",
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*サブタスク詳細*",
        },
      },
      ...subtasksMessage,
    ],
  };
};

export const postMessage = async (calcuratedTask: TParentTaskCalcurated) => {
  const message = createMessage(calcuratedTask);
  await slackClient.post("", message);
};
