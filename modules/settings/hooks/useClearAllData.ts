import { reloadAsync } from 'expo-updates';

import { useQueryClient } from '@tanstack/react-query';

import { clearDatabase } from "~/db";


export function useClearAllData() {
  const client = useQueryClient();

  const clearAllData = async () => {
    await clearDatabase();
    client.clear();
    reloadAsync();
  };

  return clearAllData;
}