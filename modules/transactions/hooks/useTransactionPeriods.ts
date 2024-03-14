import { useQuery } from '@tanstack/react-query';

import { getTransactionMonths } from "../repositories";

export const useTransactionPeriods = (accountId?: number) => {
  const {data: periods, isPending, ...others} = useQuery({
    queryKey: ['transaction-periods', accountId],
    queryFn: async () => getTransactionMonths(accountId),
  });

  return {
    ...others,
    loading: isPending,
    periods: periods ?? [],
  };
};