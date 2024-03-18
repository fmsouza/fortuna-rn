import { useMemo } from "react";
import { Card, useTheme } from "react-native-paper";
import { VictoryAxis, VictoryChart, VictoryPie, VictoryTheme } from "victory-native";
import { View } from "react-native";

import { Theme, makeStyles } from "~/theme";
import { TransactionType } from "~/modules/transactions/constants";
import { useTransactionCategories } from "~/modules/transactions/hooks";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByCategory } from "~/modules/transactions/utils";

const useStyles = makeStyles((theme: Theme) => ({
  chartContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

type CategoryPieViewProps = {
  transactions: Transaction[];
};

export function CategoryPieView({ transactions }: CategoryPieViewProps) {
  const styles = useStyles();
  const theme = useTheme() as Theme;
  const { transactionCategories } = useTransactionCategories();

  const expenseTransactionCategories = useMemo(() => transactionCategories.filter((category) => category.type === TransactionType.EXPENSE), [transactionCategories]);

  const aggregatedTransactionValues = useMemo(() => aggregateByCategory(transactions), [transactions]);
  
  const records = expenseTransactionCategories.map((category) => ({
    label: category.title,
    amount: aggregatedTransactionValues[category.id] ?? 0,
  }));
  
  return (
    <Card>
      <Card.Content>
        <Card.Title title="Expenses by category" titleVariant="titleLarge" />
        
        <View style={styles.chartContainer}>
          <VictoryChart
            theme={VictoryTheme.material}
            width={theme.viewport.width * 0.6}
            padding={{ left: 0, right: 0, bottom: 10 }}
          >
            <VictoryPie
              data={records}
              x="label"
              y="amount"
            />
            <VictoryAxis
              style={{
                ticks: { display: "none" },
                grid: { stroke: 'none' },
                axisLabel: { display: "none" },
                axis: { display: "none" },
              }}
            />
          </VictoryChart>
        </View>
      </Card.Content>
    </Card>
  );
};
