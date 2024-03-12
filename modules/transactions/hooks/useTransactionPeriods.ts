import { useQuery } from "react-query";

import { ID } from "~/modules/shared/types";

import { getTransactionMonths } from "../repositories";

export const useTransactionPeriods = (accountId?: ID) => {
  const {data: periods, isLoading, ...others} = useQuery(['transaction-periods', accountId], () => getTransactionMonths(accountId));

  return {
    ...others,
    loading: isLoading,
    periods: periods ?? [],
  };
};