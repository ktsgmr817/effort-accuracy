import { AxiosResponse } from "axios";
import { convertKeysToSnakeCase } from "../../caseConvert";
import { clickupClient } from "./clickupClient";

type TTimeEntry = {
  id: string;
  duration: string;
};

type TTimeEntriesResponse = {
  data: TTimeEntry[];
};

export const getTimeEntries = async (teamId: string, taskId: string) => {
  const query = convertKeysToSnakeCase({ taskId });
  const response: AxiosResponse<TTimeEntriesResponse> = await clickupClient.get(
    `team/${teamId}/time_entries`,
    { params: query }
  );
  const timeEntries: TTimeEntry[] = response.data.data;
  return timeEntries;
};
