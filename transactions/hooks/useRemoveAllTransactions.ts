import { useMutation, useQueryClient } from "react-query";

import { ID, Maybe } from "shared/types";

import { removeAllTransactions } from "../repositories";

export const useRemoveAllTransactions = () => {
  const client = useQueryClient();
  const {mutate, isLoading, ...others} = useMutation({
    mutationFn: async (accountId?: Maybe<ID>) => {
      await removeAllTransactions(accountId);
      await client.invalidateQueries({ queryKey: ['transaction-periods'] });
    },
  });

  return {
    ...others,
    loading: isLoading,
    removeAllTransactions: mutate,
  };
};
