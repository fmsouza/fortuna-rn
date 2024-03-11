import { useQueryClient } from "react-query";

import { clearDatabase } from "~/shared/db";


export function useClearAllData() {
  const client = useQueryClient();

  const clearAllData = async () => {
    await clearDatabase();
    client.clear();
  };

  return clearAllData;
}