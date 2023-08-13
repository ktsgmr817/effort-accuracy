import { Request, Response } from "express";
import { getTask } from "../api/clickup/getTask";
import { updateTask } from "../api/clickup/updateTask";
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
  const accuracyTask = task.customFields.find(
    (field) => field.name === "accuracy"
  );
  const accuracy = await calcParentAccuracy(task);
  console.log("calc");
  if (
    accuracyTask !== undefined &&
    accuracy !== null &&
    Number(accuracyTask.value) !== accuracy
  ) {
    await updateTask(task.id, accuracyTask.id, accuracy);
    console.log("accuracy: ", accuracy);
  }
  res.status(200).send({ req: req.query.taskId });
};
