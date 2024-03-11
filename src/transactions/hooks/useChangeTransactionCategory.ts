import { useMutation, useQueryClient } from "react-query";

import { ID } from "~/shared/types";

import { Transaction } from "../types";
import { changeTransactionCategory } from "../repositories";

export const useChangeTransactionCategory = () => {
  const client = useQueryClient();
  const {mutate, isLoading, ...others} = useMutation({
    mutationFn: async (input: {transaction: Transaction, categoryId: ID}) => {
      const {transaction, categoryId} = input;
      await changeTransactionCategory(transaction, categoryId);
      await client.invalidateQueries({ queryKey: ['transaction-periods'] });
      await client.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    ...others,
    loading: isLoading,
    changeTransactionCategory: mutate,
  };
};