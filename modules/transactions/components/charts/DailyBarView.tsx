import { useMemo } from "react";
import { useTheme } from "react-native-paper";
import { VictoryChart, VictoryTheme, VictoryBar, VictoryAxis, VictoryLabel } from "victory-native";

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
    dayOfMonth: dayOfMonth + 1,
    amount: aggregatedTransactionValues[dayOfMonth] ?? 0,
  })), [aggregatedTransactionValues, labels]);

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
          labels: { display:  ({index}) => Number(index) % 2 !== 0 ? "none" : '' }
        }}
        cornerRadius={{ top: 4 }}
        barWidth={8}
        labels={({ datum }) => `${new Date(0, 0, datum.dayOfMonth + 1).toLocaleString("default", { day: "numeric" })}`}
        labelComponent={<VictoryLabel dx={4}  />}
        data={records}
        x="dayOfMonth"
        y="amount"
        alignment="start"
      />
      <VictoryAxis
        style={{
          ticks: { display: "none" },
          grid: { stroke: theme.colors.primary, strokeOpacity: 0.4 },
        }}
      />
    </VictoryChart>
  );
};
