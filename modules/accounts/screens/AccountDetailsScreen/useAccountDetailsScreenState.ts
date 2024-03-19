import { useCallback, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import dayjs from "dayjs";

import { Maybe } from "~/modules/shared/types";
import { useAccount } from "~/modules/accounts/hooks";
import { useTransactionPeriods } from "~/modules/transactions/hooks";

export const useAccountDetailsScreenState = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const accountId = Number(params.accountId);
  const [currentPeriod, setCurrentPeriod] = useState<Maybe<Date>>(null);
  const {account, loading: accountLoading, error: accountError} = useAccount(accountId);
  const {periods, loading: loadingPeriods, error: errorPeriods} = useTransactionPeriods(accountId);

  const thisMonth = dayjs().startOf('month');
  const selectedMonth = currentPeriod && dayjs(currentPeriod).startOf('month');
  const lastMonth = dayjs(periods[periods.length - 1]).startOf('month');
  const hasPeriods = periods.length > 0;

  const handleChangePeriod = useCallback((direction: 'back' | 'next') => {
    switch (true) {

      case Boolean(direction === 'next' && selectedMonth?.isSame(thisMonth)): {
        return setCurrentPeriod(null);
      }

      case Boolean(direction === 'next' && selectedMonth?.isBefore(thisMonth)): {
        const newPeriod = selectedMonth!.add(1, 'month').toDate();
        return setCurrentPeriod(newPeriod);
      }

      case Boolean(direction === 'back' && !selectedMonth): {
        const newPeriod = thisMonth.toDate();
        return setCurrentPeriod(newPeriod);
      }

      case Boolean(direction === 'back' && selectedMonth?.isAfter(lastMonth)): {
        const newPeriod = selectedMonth!.subtract(1, 'month').toDate();
        return setCurrentPeriod(newPeriod);
      }
    }
  }, [setCurrentPeriod, thisMonth, selectedMonth, lastMonth]);

  const handlePressAddTransactions = useCallback(() => {
    router.push(`/import-transactions/${accountId}`);
  }, [router]);

  const loading = accountLoading || loadingPeriods;
  const error = accountError || errorPeriods;

  const canGoToNextMonth = Boolean(selectedMonth && hasPeriods);

  const canGoToPreviousMonth = Boolean(
    (hasPeriods && !selectedMonth) ||
    (hasPeriods && selectedMonth && selectedMonth.isAfter(lastMonth))
  );

  return {
    account,
    canGoToPreviousMonth,
    canGoToNextMonth,
    error,
    loading,
    currentPeriod,
    handleChangePeriod,
    handlePressAddTransactions,
  };
};
