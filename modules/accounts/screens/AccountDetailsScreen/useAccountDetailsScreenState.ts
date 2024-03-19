import { useCallback, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Maybe } from "~/modules/shared/types";
import { useAccount } from "~/modules/accounts/hooks";

export const useAccountDetailsScreenState = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const accountId = Number(params.accountId);
  const [currentPeriod, setCurrentPeriod] = useState<Maybe<Date>>(null);
  const {account, loading, error} = useAccount(accountId);

  const handleChangePeriod = useCallback((period: Maybe<Date>) => {
    return setCurrentPeriod(period ?? null);
  }, [setCurrentPeriod]);

  const handlePressAddTransactions = useCallback(() => {
    router.push(`/import-transactions/${accountId}`);
  }, [router]);

  const canMovePeriodBack = false;
  const canMovePeriodForward = false;

  return {
    account,
    canMovePeriodBack,
    canMovePeriodForward,
    error,
    loading,
    currentPeriod,
    handleChangePeriod,
    handlePressAddTransactions,
  };
};
