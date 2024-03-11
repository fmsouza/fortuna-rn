import React, { useMemo } from "react";

import { Account } from "accounts/types";
import { BarView } from "~/shared/components";
import { Transaction } from "transactions/types";
import { aggregateByMonth } from "transactions/utils";

const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type MonthlyBarViewProps = {
  account: Account;
  transactions: Transaction[];
};
export const MonthlyBarView: React.FC<MonthlyBarViewProps> = ({ account, transactions }) => {
  const aggregatedTransactionValues = useMemo(() => aggregateByMonth(transactions), [transactions]);
  const records = useMemo(() => LABELS.map((_, index) => aggregatedTransactionValues[index]), [aggregatedTransactionValues]);

  return (
    <BarView currency={account.currency} labels={LABELS} records={records} />
  );
};
