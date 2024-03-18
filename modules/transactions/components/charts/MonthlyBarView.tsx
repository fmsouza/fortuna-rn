import { useMemo } from "react";
import { useTheme } from "react-native-paper";

import { Theme } from "~/theme";
import { Account } from "~/modules/accounts/types";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByMonth } from "~/modules/transactions/utils";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from "victory-native";

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

type MonthlyBarViewProps = {
  account: Account;
  transactions: Transaction[];
};
export function MonthlyBarView({ account, transactions }: MonthlyBarViewProps) {
  const theme = useTheme() as Theme;
  const aggregatedTransactionValues = useMemo(() => aggregateByMonth(transactions), [transactions]);
  const records = useMemo(() => MONTHS.map((month, index) => ({
    month: month + 1,
    amount: aggregatedTransactionValues[index] ?? 0,
  })), [aggregatedTransactionValues]);

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={theme.viewport.width - theme.dimensions.spacing(2)}
      height={theme.viewport.height / 4}
      padding={{ left: 0, right: 0, bottom: 10 }}
    >
      <VictoryBar
        style={{
          data: { fill: theme.colors.primary },
          labels: { fill: "white", fontSize: 10}
        }}
        cornerRadius={{ top: 8 }}
        barWidth={20}
        labels={({ datum }) => `${new Date(0, datum.month - 1).toLocaleString("default", { month: "short" })}`}
        labelComponent={<VictoryLabel dy={30} dx={10} />}
        data={records}
        x="month"
        y="amount"
        alignment="start"
      />
      <VictoryAxis
        style={{
          ticks: { display: "none" },
          grid: { stroke: theme.colors.primary, strokeOpacity: 0.4 },
          axisLabel: { display: "none" },
        }}
      />
    </VictoryChart>
  );
};
