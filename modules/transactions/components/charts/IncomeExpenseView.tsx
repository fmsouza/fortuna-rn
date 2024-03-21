import { useMemo } from "react";
import { Card, useTheme } from "react-native-paper";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from "victory-native";

import { useText } from "~/intl";
import { Theme } from "~/theme";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByType } from "~/modules/transactions/utils";

type IncomeExpenseViewProps = {
  transactions: Transaction[];
};

export function IncomeExpenseView({ transactions }: IncomeExpenseViewProps) {
  const theme = useTheme() as Theme;
  const t = useText();

  const { income: incomeAmount, expense: expenseAmount } = useMemo(
    () => aggregateByType(transactions),
    [transactions]
  );

  const records = [
    { title: t("screens.accountDetails.income"), amount: incomeAmount },
    { title: t("screens.accountDetails.expense"), amount: expenseAmount },
  ];

  return (
    <Card>
      <Card.Content>
        <Card.Title
          title={t("screens.accountDetails.incomeExpense")}
          titleVariant="titleLarge"
        />

        <VictoryChart
          horizontal
          width={theme.viewport.width * 0.9}
          height={130}
          theme={VictoryTheme.material}
        >
          <VictoryBar
            style={{
              data: {
                fill: ({ index }) =>
                  index === 0 ? theme.colors.primary : theme.colors.error,
              },
            }}
            cornerRadius={{ top: 10 }}
            barWidth={20}
            data={records}
            x="title"
            y="amount"
          />
          <VictoryAxis
            style={{
              ticks: { display: "none" },
              grid: { display: "none" },
              axisLabel: { display: "none" },
            }}
          />
        </VictoryChart>
      </Card.Content>
    </Card>
  );
}
