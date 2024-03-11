import { useQuery } from "react-query";

import { ID, Maybe } from "shared/types";

import { Account } from "../types";
import { getAccountById } from "../repositories";

export const useAccount = (accountId: ID) => {
  const {data: account, isLoading, ...others} = useQuery<Maybe<Account>>({
    queryKey: ["account", accountId],
    queryFn: async () => getAccountById(accountId),
  });

  return {
    ...others,
    loading: isLoading,
    account,
  };
};
