import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Transaction } from "../types";
import { changeTransactionCategory } from "../repositories";

export const useChangeTransactionCategory = () => {
  const client = useQueryClient();
  const {mutate, isPending, ...others} = useMutation({
    mutationFn: async (input: {transactions: Transaction[], categoryId: number}) => {
      const {transactions, categoryId} = input;
      await Promise.all(
        transactions.map(transaction => changeTransactionCategory(transaction, categoryId))
      );
      await client.invalidateQueries({ queryKey: ['transaction-periods'] });
      await client.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    ...others,
    loading: isPending,
    changeTransactionCategory: mutate,
  };
};