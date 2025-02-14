import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Maybe } from "~/modules/shared/types";

import { removeAllTransactions } from "../repositories";

export const useRemoveAllTransactions = () => {
  const client = useQueryClient();
  const {mutate, isPending, ...others} = useMutation({
    mutationFn: async (accountId?: Maybe<number>) => {
      await removeAllTransactions(accountId);
      await client.invalidateQueries({ queryKey: ['transaction-periods'] });
    },
  });

  return {
    ...others,
    loading: isPending,
    removeAllTransactions: mutate,
  };
};
