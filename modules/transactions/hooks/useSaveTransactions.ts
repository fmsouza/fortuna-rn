import { useMutation, useQueryClient } from "react-query";

import { asyncFilter } from "~/modules/shared/utils";

import { batchSaveTransactions, transactionAlreadyExists } from "../repositories";
import { TransactionInput } from "../types";

export const useSaveTransactions = () => {
  const client = useQueryClient();
  const {mutate, isLoading, ...others} = useMutation({
    mutationFn: async (inputs: TransactionInput[]) => {
      const items = await asyncFilter(inputs, async (input) => !(await transactionAlreadyExists(input)));
      await batchSaveTransactions(items);
      await client.invalidateQueries({ queryKey: ['transaction-periods'] });
      await client.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    ...others,
    loading: isLoading,
    saveTransactions: mutate,
  };
};
