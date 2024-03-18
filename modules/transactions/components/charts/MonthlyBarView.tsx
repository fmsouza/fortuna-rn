import { useMemo } from "react";
import { useTheme } from "react-native-paper";

import { Theme } from "~/theme";
import { Account } from "~/modules/accounts/types";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByMonth } from "~/modules/transactions/utils";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

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
      width={theme.viewport.width}
      height={theme.viewport.height / 4}
    >
      <VictoryBar
        style={{ data: { fill: theme.colors.primary } }}
        cornerRadius={{ top: 8 }}
        barWidth={20}
        data={records}
        x="month"
        y="amount"
      />
      <VictoryAxis
        style={{
          ticks: { display: "none" },
          grid: { stroke: theme.colors.primary, strokeOpacity: 0.4 },
          axisLabel: { display: "none" },
        }}
        tickFormat={(t) => `${new Date(0, t - 1).toLocaleString("default", { month: "short" })}`}
      />
    </VictoryChart>
  );
};
