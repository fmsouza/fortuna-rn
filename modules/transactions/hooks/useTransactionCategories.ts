import { useQuery } from '@tanstack/react-query';

import { getTransactionCategories } from "../repositories";

export const useTransactionCategories = () => {
  const {data: categories, isPending, ...others} = useQuery('transaction-categories', async () => getTransactionCategories());

  return {
    ...others,
    loading: isPending,
    transactionCategories: categories ?? [],
  };
};