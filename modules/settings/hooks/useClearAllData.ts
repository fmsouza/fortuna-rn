import { useQueryClient } from '@tanstack/react-query';

import { clearDatabase } from "~/modules/shared/db";


export function useClearAllData() {
  const client = useQueryClient();

  const clearAllData = async () => {
    await clearDatabase();
    client.clear();
  };

  return clearAllData;
}