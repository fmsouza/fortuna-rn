import { useMutation, useQueryClient } from "react-query";

import { removeAccount } from "../repositories";
import { Account } from "../types";

export const useRemoveAccount = () => {
  const client = useQueryClient();
  const {mutate, error, isLoading} = useMutation({
    mutationFn: async (account: Account) => {
      await removeAccount(account);
      await client.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  return {
    loading: isLoading,
    error,
    removeAccount: mutate,
  };
};
