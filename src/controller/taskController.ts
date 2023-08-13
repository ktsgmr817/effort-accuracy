import { Request, Response } from "express";
import { getTask } from "../api/clickup/getTask";
import { updateTask } from "../api/clickup/updateTask";
import { postMessage } from "../api/slack/postCalcMessage";
import { calcParentAccuracy } from "../calcParentAccuracy";

type TQuery = {
  taskId: string;
};

export const closed = async (
  req: Request<{}, {}, {}, TQuery>,
  res: Response
) => {
  const taskId = req.query.taskId;
  console.log(taskId);
  const task = await getTask(taskId);
  console.log("gettask");
  const accuracyField = task.customFields.find(
    (field) => field.name === "accuracy"
  );
  const calcuratedTask = await calcParentAccuracy(task);
  console.log("calc");
  if (accuracyField !== undefined && calcuratedTask !== null) {
    await updateTask(task.id, accuracyField, calcuratedTask.accuracy);
    await postMessage(calcuratedTask);
    console.log("accuracy: ", calcuratedTask.accuracy);
  }
  res.status(200).send({ accuracy: calcuratedTask?.accuracy });
};
