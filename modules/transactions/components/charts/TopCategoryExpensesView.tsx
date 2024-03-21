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
import { TransactionType } from "~/modules/transactions/constants";
import { useTransactionCategories } from "~/modules/transactions/hooks";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByCategory } from "~/modules/transactions/utils";

type TopCategoryExpensesViewProps = {
  limit?: number;
  transactions: Transaction[];
};

export function TopCategoryExpensesView({
  limit = 3,
  transactions,
}: TopCategoryExpensesViewProps) {
  const theme = useTheme() as Theme;
  const t = useText();
  const { transactionCategories } = useTransactionCategories();

  const mostExpensiveCategories: Array<{ title: string; amount: number }> =
    useMemo(() => {
      const expenseTransactions = transactions.filter(
        (trx) => trx.type === TransactionType.EXPENSE
      );
      const byCategory = aggregateByCategory(expenseTransactions);
      const categories = Object.keys(byCategory).map((category) => ({
        title:
          transactionCategories.find(
            (transactionCategory) => transactionCategory.id === Number(category)
          )?.title ?? "?",
        amount: byCategory[Number(category)],
      }));
      return categories.sort((a, b) => a.amount - b.amount).slice(0, limit);
    }, [transactionCategories, transactions]);

  return (
    <Card>
      <Card.Content>
        <Card.Title
          title={t("screens.accountDetails.topCategoryExpenses")}
          titleVariant="titleLarge"
        />

        <VictoryChart
          horizontal
          width={theme.viewport.width * 0.9}
          height={theme.viewport.height * 0.25}
          theme={VictoryTheme.material}
        >
          <VictoryBar
            style={{ data: { fill: theme.colors.primary } }}
            cornerRadius={{ top: 5 }}
            barWidth={40}
            data={mostExpensiveCategories}
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
      </Card.Content>
    </Card>
  );
}
