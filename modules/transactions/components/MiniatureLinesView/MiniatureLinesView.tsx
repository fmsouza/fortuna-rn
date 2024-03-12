import { useMemo } from "react";
import { ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

import { Transaction } from "~/modules/transactions/types";
import { aggregateByMonth } from "~/modules/transactions/utils";

const CHART_OPTIONS: ChartOptions = {
  responsive: true,
  animation: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  }
};

const LABELS = Array.from({length: 12}, () => '');

type MiniatureLinesViewProps = {
  transactions: Transaction[];
};

export const MiniatureLinesView: React.FC<MiniatureLinesViewProps> = ({transactions}) => {
  const aggregatedTransactionValues = useMemo(() => aggregateByMonth(transactions), [transactions]);
  const records = useMemo(() => LABELS.map((_, index) => aggregatedTransactionValues[index + 1]), [aggregatedTransactionValues]);
  
  const balance = useMemo(() => {
    return transactions.reduce((acc, transaction) => acc + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 0);
  }, [transactions]);

  return (
    <Line options={CHART_OPTIONS as any} data={{
      labels: LABELS,
      datasets: [
        {
          data: records,
          borderColor: balance > 0 ? '#2dd36f' : '#eb445a',
          pointRadius: 0,
          pointHitRadius: 0,
          tension: 0.7,
        },
      ],
    }} />
  )
};
