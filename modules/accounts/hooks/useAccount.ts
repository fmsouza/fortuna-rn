import { useQuery } from '@tanstack/react-query';

import { Maybe } from "~/modules/shared/types";

import { Account } from "../types";
import { getAccountById } from "../repositories";

export const useAccount = (accountId?: number) => {
  const {data: account, isPending, ...others} = useQuery<Maybe<Account>>({
    queryKey: ["account", accountId],
    queryFn: async () => accountId ? getAccountById(accountId) : null,
  });

  return {
    ...others,
    loading: isPending,
    account,
  };
};
