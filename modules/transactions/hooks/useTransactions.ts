import { useQuery } from '@tanstack/react-query';

import { Maybe } from "~/modules/shared/types";

import { getTransactions } from "../repositories";

type UseTransactionsInput = {
  accountId?: Maybe<number>,
  dates?: Maybe<{ from: Date, to: Date }>,
};

export const useTransactions = (filters: UseTransactionsInput) => {
  const {data: transactions, isPending, ...others} = useQuery({
    queryKey: ["transactions", filters],
    queryFn: async () => getTransactions(filters),
  });

  return {
    ...others,
    loading: isPending,
    transactions: transactions ?? [],
  };
};