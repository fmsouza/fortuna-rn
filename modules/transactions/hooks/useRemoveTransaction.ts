import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeTransaction } from "../repositories";
import { Transaction } from "../types";

export const useRemoveTransaction = () => {
  const client = useQueryClient();
  const {mutate, isPending, ...others} = useMutation({
    mutationFn: async (trx: Transaction) => {
      await removeTransaction(trx);
      await client.invalidateQueries({ queryKey: ['transaction-periods'] });
      await client.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    ...others,
    loading: isPending,
    removeTransaction: mutate,
  };
};
