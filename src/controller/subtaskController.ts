import { Request, Response } from "express";
import { getTask } from "../api/clickup/getTask";
import { updateTask } from "../api/clickup/updateTask";
import { calcParentAccuracy } from "../calcParentAccuracy";

type TQuery = {
  taskId: string;
};

export const done = async (req: Request<{}, {}, {}, TQuery>, res: Response) => {
  const taskId = req.query.taskId;
  const task = await getTask(taskId);
  const accuracyTask = task.customFields.find(
    (field) => field.name === "accuracy"
  );
  const accuracy = await calcParentAccuracy(task);
  if (
    accuracyTask !== undefined &&
    accuracy !== null &&
    Number(accuracyTask.value) !== accuracy
  ) {
    await updateTask(task.id, accuracyTask.id, accuracy);
  }
  res.status(200).send({ req: req.query.taskId });
};
