import { useQuery } from '@tanstack/react-query';

import { ID, Maybe } from "~/modules/shared/types";

import { Account } from "../types";
import { getAccountById } from "../repositories";

export const useAccount = (accountId: ID) => {
  const {data: account, isPending, ...others} = useQuery<Maybe<Account>>({
    queryKey: ["account", accountId],
    queryFn: async () => getAccountById(accountId),
  });

  return {
    ...others,
    loading: isPending,
    account,
  };
};
