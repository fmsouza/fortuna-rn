import { useMemo } from "react";
import { Card, useTheme } from "react-native-paper";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

import { Theme } from "~/theme";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByType } from "~/modules/transactions/utils";

type IncomeExpenseViewProps = {
  transactions: Transaction[];
};

export function IncomeExpenseView({ transactions }: IncomeExpenseViewProps) {
  const theme = useTheme() as Theme;
  const { income: incomeAmount, expense: expenseAmount } = useMemo(() => aggregateByType(transactions), [transactions]);

  const records = [
    { title: "Income", amount: incomeAmount },
    { title: "Expense", amount: expenseAmount },
  ];
  
  return (
    <Card>
      <Card.Content>
        <Card.Title title="Income & expenses" titleVariant="titleLarge" />
        
        <VictoryChart
          horizontal
          width={theme.viewport.width * 0.9}
          height={130}
          theme={VictoryTheme.material}
        >
          <VictoryBar
            style={{ data: { fill: ({ index }) => index === 0 ? theme.colors.primary : theme.colors.error } }}
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
};
