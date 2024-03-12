import React, { useMemo } from "react";

import { Account } from "~/modules/accounts/types";
import { BarView } from "~/shared/components";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByDayOfMonth, listDaysInMonth } from "~/modules/transactions/utils";

type DailyBarViewProps = {
  account: Account;
  transactions: Transaction[];
};
export const DailyBarView: React.FC<DailyBarViewProps> = ({ account, transactions }) => {
  const labels = useMemo(() => listDaysInMonth(transactions[0].registeredAt), [transactions]);
  const aggregatedTransactionValues = useMemo(() => aggregateByDayOfMonth(transactions), [transactions]);
  const records = useMemo(() => labels.map((dayOfMonth) => aggregatedTransactionValues[dayOfMonth]), [labels, aggregatedTransactionValues]);

  return (
    <BarView currency={account.currency} labels={labels} records={records} />
  );
};
