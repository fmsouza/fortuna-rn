import { useQuery } from '@tanstack/react-query';

import { ID, Maybe } from "~/modules/shared/types";

import { getTransactions } from "../repositories";

type UseTransactionsInput = {
  accountId?: Maybe<ID>,
  dates?: Maybe<{ from: Date, to: Date }>,
};

export const useTransactions = (filters: UseTransactionsInput) => {
  const {data: transactions, isPending, ...others} = useQuery(['transactions', filters], () => getTransactions(filters));

  return {
    ...others,
    loading: isPending,
    transactions: transactions ?? [],
  };
};