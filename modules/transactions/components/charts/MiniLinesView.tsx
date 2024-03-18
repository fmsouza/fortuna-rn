import { useMemo } from "react";
import { CartesianChart, Line } from "victory-native";

import { Transaction } from "~/modules/transactions/types";
import { aggregateByMonth } from "~/modules/transactions/utils";

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

type MiniLinesViewProps = {
  transactions: Transaction[];
};

export function MiniLinesView({transactions}: MiniLinesViewProps) {
  const aggregatedTransactionValues = useMemo(() => aggregateByMonth(transactions), [transactions]);
  const records = useMemo(() => MONTHS.map((month, index) => ({
    month,
    amount: aggregatedTransactionValues[index],
  })), [aggregatedTransactionValues]);
  
  const balance = useMemo(() => {
    return transactions.reduce((acc, transaction) => acc + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 0);
  }, [transactions]);

  return (
    <CartesianChart 
      data={records}
      xKey="month"
      yKeys={["amount"]}
      padding={{ top: 0, right: 0, bottom: 10, left: 0 }}
    >
      {({ points }) => (
        <Line
          points={points.amount}
          color={balance > 0 ? 'green' : 'red'}
          strokeWidth={3}
          animate={{ type: "timing", duration: 300 }}
        />
      )}
    </CartesianChart>
  )
};
