import { useQuery } from "react-query";

import { getTransactionCategories } from "../repositories";

export const useTransactionCategories = () => {
  const {data: categories, isLoading, ...others} = useQuery('transaction-categories', async () => getTransactionCategories());

  return {
    ...others,
    loading: isLoading,
    transactionCategories: categories ?? [],
  };
};