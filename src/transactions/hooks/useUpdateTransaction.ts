import { useMutation, useQueryClient } from "react-query";

import { Transaction } from "../types";
import { updateTransaction } from "../repositories";

export const useUpdateTransaction = () => {
  const client = useQueryClient();
  const {mutate, isLoading, ...others} = useMutation({
    mutationFn: async (trxn: Transaction) => {
      await updateTransaction(trxn);
      await client.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    ...others,
    loading: isLoading,
    updateTransaction: mutate,
  };
};