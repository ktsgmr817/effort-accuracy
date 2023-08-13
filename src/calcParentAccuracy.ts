import { TTaskResponse } from "./api/clickup/getTask";
import { getTimeEntries } from "./api/clickup/getTimeEntries";

type TTaskCalcurated = {
  name: string;
  timeEstimate: number;
  duration: number;
  accuracy: number;
};

export type TSubtaskCalcurated = { index: number } & TTaskCalcurated;

export type TParentTaskCalcurated = TTaskCalcurated & {
  subtasks: TSubtaskCalcurated[];
};

export const calcParentAccuracy = async (
  task: TTaskResponse
): Promise<TParentTaskCalcurated | null> => {
  if (
    task.subtasks.length === 0 ||
    !["done", "closed"].includes(task.status.type)
  ) {
    return null;
  }

  const parentTaskCalcurated: TParentTaskCalcurated = {
    name: task.name,
    timeEstimate: 0,
    duration: 0,
    accuracy: 0,
    subtasks: [],
  };
  const promises: Promise<void>[] = [];
  for (let i = 0; i < task.subtasks.length; i++) {
    if (
      ["done", "closed"].includes(task.subtasks[i].status.type) &&
      task.subtasks[i].timeEstimate === null
    ) {
      continue;
    }
    const subtask = task.subtasks[i];
    const timeEntriesPromise = getTimeEntries(task.teamId, subtask.id)
      .then((timeEntries) => {
        if (timeEntries.length === 0) return;
        const sumDuration = timeEntries.reduce((sum, element) => {
          return sum + Number(element.duration);
        }, 0);
        const accuracy =
          (Math.abs(sumDuration - subtask.timeEstimate!) / sumDuration) * 100; // %で計算
        parentTaskCalcurated.subtasks.push({
          index: i,
          name: subtask.name,
          timeEstimate: subtask.timeEstimate!,
          duration: sumDuration,
          accuracy: accuracy,
        });
      })
      .catch((error) => {
        console.error(error);
      });
    promises.push(timeEntriesPromise);
  }

  await Promise.all(promises);

  // 子タスクの平均を親タスクのaccuracyとする
  let parentTotalAccuracy = 0;
  for (let i = 0; i < parentTaskCalcurated.subtasks.length; i++) {
    const subtask = parentTaskCalcurated.subtasks[i];
    parentTaskCalcurated.timeEstimate += subtask.timeEstimate;
    parentTaskCalcurated.duration += subtask.duration;
    parentTotalAccuracy += subtask.accuracy;
  }
  const parentAvgAccuracy =
    parentTotalAccuracy / parentTaskCalcurated.subtasks.length;
  parentTaskCalcurated.accuracy = Math.round(parentAvgAccuracy * 10) / 10;

  return parentTaskCalcurated;
};
