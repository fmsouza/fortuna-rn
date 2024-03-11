import { useMutation, useQueryClient } from "react-query";

import { saveAccount } from "../repositories";
import { Account } from "../types";

export const useSaveAccount = () => {
  const client = useQueryClient();
  const {mutate, error, isLoading} = useMutation({
    mutationFn: async (account: Partial<Account>) => {
      await saveAccount(account);
      await client.invalidateQueries({ queryKey: ['accounts'] });
    }
  });

  return {
    loading: isLoading,
    error,
    saveAccount: mutate,
  };
};