import { useQuery } from '@tanstack/react-query';

import { getAccounts } from "../repositories";

export const useAccounts = () => {
  const {data: accounts, isPending, ...others} = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => getAccounts(),
  });

  return {
    ...others,
    loading: isPending,
    accounts: accounts ?? [],
  };
};
