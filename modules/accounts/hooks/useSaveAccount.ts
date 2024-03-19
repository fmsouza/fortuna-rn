import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SaveAccountInput, saveAccount } from "../repositories";

export const useSaveAccount = () => {
  const client = useQueryClient();
  const {mutate, error, isPending} = useMutation({
    mutationFn: async (account: SaveAccountInput) => {
      await saveAccount(account);
      await client.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  return {
    loading: isPending,
    error,
    saveAccount: mutate,
  };
};