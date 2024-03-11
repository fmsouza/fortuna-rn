import { useQuery } from "react-query";

import { getAccounts } from "../repositories";

export const useAccounts = () => {
  const {data: accounts, isLoading, ...others} = useQuery('accounts', () => getAccounts());

  return {
    ...others,
    loading: isLoading,
    accounts: accounts ?? [],
  };
};
