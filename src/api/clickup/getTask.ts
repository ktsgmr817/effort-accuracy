import { AxiosResponse } from "axios";
import { convertKeysToSnakeCase } from "../../caseConvert";
import { clickupClient } from "./clickupClient";

export type TCustomField = {
  id: string;
  name: string;
  value?: string;
};

type TTask = {
  id: string;
  name: string;
  parent: string | null;
  timeEstimate: number | null;
  customFields: TCustomField[];
  status: {
    status: string;
    type: string;
  };
};

export type TTaskResponse = TTask & {
  teamId: string;
  subtasks: TTask[];
};

export const getTask = async (taskId: string) => {
  const query = convertKeysToSnakeCase({
    includeSubtasks: "true",
  });
  const response: AxiosResponse<TTaskResponse> = await clickupClient.get(
    `task/${taskId}`,
    { params: query }
  );
  const task: TTaskResponse = response.data;
  return task;
};
