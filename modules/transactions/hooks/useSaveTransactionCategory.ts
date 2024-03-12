import { useMutation, useQueryClient } from '@tanstack/react-query';

import { saveTransactionCategory } from "../repositories";
import { TransactionCategoryInput } from "../types";

export const useSaveTransactionCategory = () => {
  const client = useQueryClient();
  const {mutate, isPending, ...others} = useMutation({
    mutationFn: async (category: TransactionCategoryInput) => {
      await saveTransactionCategory(category);
      await client.invalidateQueries({ queryKey: ['transaction-categories'] });
    },
  });

  return {
    ...others,
    loading: isPending,
    saveTransactionCategory: mutate,
  };
};