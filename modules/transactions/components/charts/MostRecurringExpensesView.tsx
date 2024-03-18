import { Link } from "expo-router";
import { useMemo } from "react";
import { Button, Card, Text } from "react-native-paper";
import { CURRENCY_SYMBOLS } from "~/modules/accounts/constants";

import { Account } from "~/modules/accounts/types";
import { Maybe } from "~/modules/shared/types";
import { TransactionType } from "~/modules/transactions/constants";
import { Transaction } from "~/modules/transactions/types";
import { countTransactionsByTitle, sumTransactionsByTitle } from "~/modules/transactions/utils";
import { makeStyles } from "~/theme";

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

export function MostRecurringExpensesView({ account, limit = 3, period, transactions }: MostRecurringExpensesViewProps) {
  const styles = useStyles();

  const viewMoreLink = `/account/${account.id}/transactions${period ? `?period=${period.toISOString()}` : ''}`;
  
  const mostRecurrentTransactions: Array<{ title: string, count: number, amount: number }> = useMemo(() => {
    const expenseTransactions = transactions.filter((trx) => trx.type === TransactionType.EXPENSE);
    const groups = countTransactionsByTitle(expenseTransactions);
    const sumByTitle = sumTransactionsByTitle(expenseTransactions);
    return Object.entries(groups).sort((a, b) => b[1] - a[1]).map(([title, count]) => ({
      title,
      count,
      amount: sumByTitle[title],
    }));
  }, [transactions]);
  
  return (
    <Card>
      <Card.Content>
        <Card.Title title="Most recurring expenses" titleVariant="titleLarge" />
        {mostRecurrentTransactions.slice(0, limit).map(({title, count, amount}) => (
          <Card.Content key={title} style={styles.trxnItem}>
            <Text variant="titleMedium">{title}</Text>
            <Text variant="bodyMedium">Total: {`${CURRENCY_SYMBOLS[account.currency]} ${amount.toFixed(2)}`}</Text>
            <Text variant="bodyMedium">Registered {count} times</Text>
          </Card.Content>
        ))}
      </Card.Content>
      <Card.Actions>
        <Link href={viewMoreLink} asChild>
          <Button mode="text">View more</Button>
        </Link>
      </Card.Actions>
    </Card>
    );
  };
