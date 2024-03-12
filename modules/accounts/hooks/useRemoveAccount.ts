import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeAccount } from "../repositories";
import { Account } from "../types";

export const useRemoveAccount = () => {
  const client = useQueryClient();
  const {mutate, error, isPending} = useMutation({
    mutationFn: async (account: Account) => {
      await removeAccount(account);
      await client.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  return {
    loading: isPending,
    error,
    removeAccount: mutate,
  };
};
