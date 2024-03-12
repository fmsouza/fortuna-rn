import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveAccount } from "../repositories";
import { Account } from "../types";

export const useSaveAccount = () => {
  const client = useQueryClient();
  const {mutate, error, isPending} = useMutation({
    mutationFn: async (account: Partial<Account>) => {
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