import { useQuery } from "react-query";

import { ID, Maybe } from "~/modules/shared/types";

import { getTransactions } from "../repositories";

type UseTransactionsInput = {
  accountId?: Maybe<ID>,
  dates?: Maybe<{ from: Date, to: Date }>,
};

export const useTransactions = (filters: UseTransactionsInput) => {
  const {data: transactions, isLoading, ...others} = useQuery(['transactions', filters], () => getTransactions(filters));

  return {
    ...others,
    loading: isLoading,
    transactions: transactions ?? [],
  };
};