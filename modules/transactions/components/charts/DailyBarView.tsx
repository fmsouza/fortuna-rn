import { useMemo } from "react";
import { useTheme } from "react-native-paper";
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis } from "victory-native";

import { Theme } from "~/theme";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByDayOfMonth, listDaysInMonth } from "~/modules/transactions/utils";

type DailyBarViewBarViewProps = {
  transactions: Transaction[];
};
export function DailyBarViewBarView({ transactions }: DailyBarViewBarViewProps) {
  const theme = useTheme() as Theme;

  const labels = useMemo(() => listDaysInMonth(transactions[0].registeredAt), [transactions]);
  const aggregatedTransactionValues = useMemo(() => aggregateByDayOfMonth(transactions), [transactions]);
  const records = useMemo(() => labels.map((dayOfMonth) => ({
    dayOfMonth,
    amount: aggregatedTransactionValues[dayOfMonth] ?? 0,
  })), [aggregatedTransactionValues, labels]);

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={theme.viewport.width}
      height={theme.viewport.height / 4}
    >
      <VictoryBar
        style={{ data: { fill: theme.colors.primary } }}
        cornerRadius={{ top: 4 }}
        barWidth={8}
        data={records}
        x="dayOfMonth"
        y="amount"
      />
      <VictoryAxis
        style={{
          ticks: { display: "none" },
          grid: { stroke: theme.colors.primary, strokeOpacity: 0.4 },
          axisLabel: { display: "none" },
        }}
        tickFormat={(t) => `${new Date(0, 0, t + 1).toLocaleString("default", { day: "numeric" })}`}
      />
    </VictoryChart>
  );
};
