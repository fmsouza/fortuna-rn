import { useMemo } from "react";
import { View } from "react-native";
import { Card, useTheme } from "react-native-paper";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory-native";

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

type CategoryBreakdownViewProps = {
  transactions: Transaction[];
};

export function CategoryBreakdownView({ transactions }: CategoryBreakdownViewProps) {
  const styles = useStyles();
  const theme = useTheme() as Theme;
  const { transactionCategories } = useTransactionCategories();

  const categories: Array<{ title: string, amount: number }> = useMemo(() => {
    const expenseTransactions = transactions.filter((trx) => trx.type === TransactionType.EXPENSE);
    const byCategory = aggregateByCategory(expenseTransactions);
    const categories = Object.keys(byCategory).map(category => ({
      title: transactionCategories.find(transactionCategory => transactionCategory.id === Number(category))?.title ?? '?',
      amount: byCategory[Number(category)],
    }));
    return categories.sort((a, b) => a.amount - b.amount);
  }, [transactionCategories, transactions]);

  const height = categories.length * (60 + theme.dimensions.spacing(2));
  
  return (
    <Card>
      <Card.Content>
        <Card.Title title="Expenses by category" titleVariant="titleLarge" />
        
        <View style={styles.chartContainer}>
        
          <VictoryChart
            horizontal
            width={theme.viewport.width * 0.9}
            height={height}
            theme={VictoryTheme.material}
          >
            <VictoryBar
              style={{ data: { fill: theme.colors.primary } }}
              cornerRadius={{ top: 5 }}
              barWidth={40}
              data={categories}
              x="title"
              y="amount"
            />
            <VictoryAxis
              style={{
                ticks: { display: "none" },
                grid: { stroke: theme.colors.primary, strokeOpacity: 0.4 },
                axisLabel: { display: "none" },
              }}
            />
          </VictoryChart>
        </View>
      </Card.Content>
    </Card>
  );
};
