import React, { useMemo } from "react";

import { Account } from "~/accounts/types";
import { BarView } from "~/shared/components";
import { Transaction } from "~/transactions/types";
import { aggregateByDayOfMonth, listDaysInMonth } from "~/transactions/utils";

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
