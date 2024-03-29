import { Link } from "expo-router";
import { useMemo } from "react";
import { Button, Card, Text } from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { Account } from "~/modules/accounts/types";
import { CURRENCY_SYMBOLS } from "~/modules/accounts/constants";
import { TransactionType } from "~/modules/transactions/constants";
import { Transaction } from "~/modules/transactions/types";
import {
  countTransactionsByTitle,
  sumTransactionsByTitle,
} from "~/modules/transactions/utils";

const useStyles = makeStyles((theme) => ({
  trxnItem: {
    paddingVertical: theme.dimensions.spacing(),
  },
}));

type MostRecurringExpensesViewProps = {
  account: Account;
  limit?: number;
  period?: Maybe<Date>;
  transactions: Transaction[];
};

export function MostRecurringExpensesView({
  account,
  limit = 3,
  period,
  transactions,
}: MostRecurringExpensesViewProps) {
  const styles = useStyles();
  const t = useText();

  const viewMoreLink = `/account/${account.id}/transactions${
    period ? `?period=${period.toISOString()}` : ""
  }`;

  const mostRecurrentTransactions: Array<{
    title: string;
    count: number;
    amount: number;
  }> = useMemo(() => {
    const expenseTransactions = transactions.filter(
      (trx) => trx.type === TransactionType.EXPENSE
    );
    const groups = countTransactionsByTitle(expenseTransactions);
    const sumByTitle = sumTransactionsByTitle(expenseTransactions);
    return Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .map(([title, count]) => ({
        title,
        count,
        amount: sumByTitle[title],
      }));
  }, [transactions]);

  return (
    <Card>
      <Card.Content>
        <Card.Title
          title={t("screens.accountDetails.mostRecurringExpenses")}
          titleVariant="titleLarge"
        />
        {mostRecurrentTransactions
          .slice(0, limit)
          .map(({ title, count, amount }) => (
            <Card.Content key={title} style={styles.trxnItem}>
              <Text variant="titleMedium">{title}</Text>
              <Text variant="bodyMedium">
                {t("screens.transactions.total", {
                  currency: CURRENCY_SYMBOLS[account.currency],
                  amount: amount.toFixed(2),
                })}
              </Text>
              <Text variant="bodyMedium">
                {t("screens.transactions.registeredTimes", {
                  count: String(count),
                })}
              </Text>
            </Card.Content>
          ))}
      </Card.Content>
      <Card.Actions>
        <Link href={viewMoreLink} asChild>
          <Button mode="text">{t("common.actions.viewMore")}</Button>
        </Link>
      </Card.Actions>
    </Card>
  );
}
