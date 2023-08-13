import { clickupClient } from "./clickupClient";
import { TCustomField } from "./getTask";

export const updateTask = async (
  taskId: string,
  field: TCustomField,
  updateValue: number
) => {
  if (Number(field.value) === updateValue) return;
  await clickupClient.post(`/task/${taskId}/field/${field.id}`, {
    value: updateValue,
  });
};
