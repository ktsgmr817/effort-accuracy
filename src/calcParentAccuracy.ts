import { TTaskResponse } from "./api/clickup/getTask";
import { getTimeEntries } from "./api/clickup/getTimeEntries";

export const calcParentAccuracy = async (task: TTaskResponse) => {
  if (
    task.subtasks.length === 0 ||
    !["done", "closed"].includes(task.status.type)
  ) {
    return null;
  }

  const accuracies: number[] = [];
  const promises: Promise<void>[] = [];
  for (let i = 0; i < task.subtasks.length; i++) {
    if (
      ["done", "closed"].includes(task.subtasks[i].status.type) &&
      task.subtasks[i].timeEstimate === null
    ) {
      continue;
    }
    const timeEntriesPromise = getTimeEntries(task.teamId, task.subtasks[i].id)
      .then((timeEntries) => {
        if (timeEntries.length === 0) return;
        const sumDuration = timeEntries.reduce((sum, element) => {
          return sum + Number(element.duration);
        }, 0);
        const accuracy =
          Math.abs(sumDuration - task.subtasks[i].timeEstimate!) / sumDuration;
        accuracies.push(accuracy);
      })
      .catch((error) => {
        console.error(error);
      });
    promises.push(timeEntriesPromise);
  }

  await Promise.all(promises);

  // 子タスクの平均を親タスクのaccuracyとする
  const averageAccuracy =
    (accuracies.reduce((sum, element) => {
      return sum + element;
    }) /
      accuracies.length) *
    100;
  const fixedAccuracy = Math.round(averageAccuracy * 10) / 10;
  return fixedAccuracy;
};
