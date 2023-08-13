import { clickupClient } from "./clickupClient";

export const updateTask = async (
  taskId: string,
  fieldId: string,
  value: number
) => {
  await clickupClient.post(`/task/${taskId}/field/${fieldId}`, {
    value,
  });
};
