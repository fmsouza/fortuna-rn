import { useMutation, useQueryClient } from '@tanstack/react-query';

import { asyncFilter } from "~/modules/shared/utils";

import { batchSaveTransactions, transactionAlreadyExists } from "../repositories";
import { TransactionInput } from "../types";

export const useSaveTransactions = () => {
  const client = useQueryClient();
  const {mutate, isPending, ...others} = useMutation({
    mutationFn: async (inputs: TransactionInput[]) => {
      const items = await asyncFilter(inputs, async (input) => !(await transactionAlreadyExists(input)));
      await batchSaveTransactions(items);
      await client.invalidateQueries({ queryKey: ['transaction-periods'] });
      await client.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    ...others,
    loading: isPending,
    saveTransactions: mutate,
  };
};
