import { Link } from "expo-router";
import { useMemo } from "react";
import { Button, Card, Text } from "react-native-paper";

import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { Account } from "~/modules/accounts/types";
import { CURRENCY_SYMBOLS } from "~/modules/accounts/constants";
import { TransactionType } from "~/modules/transactions/constants";
import { Transaction } from "~/modules/transactions/types";

const useStyles = makeStyles((theme) => ({
  trxnItem: {
    paddingVertical: theme.dimensions.spacing(),
  },
}));

type TopTransactionsViewProps = {
  account: Account;
  limit?: number;
  period?: Maybe<Date>;
  transactions: Transaction[];
};

export function TopTransactionsView({ account, limit = 3, period, transactions }: TopTransactionsViewProps) {
  const styles = useStyles();

  const viewMoreLink = `/accounts/${account.id}/recurring-transactions${period ? `?period=${period.toISOString()}` : ''}`;

  const mostExpensiveTransactions = useMemo(() => {
    const expenseTransactions = transactions.filter((trx) => trx.type === TransactionType.EXPENSE);
    return expenseTransactions.sort((a, b) => b.amount - a.amount);
  }, [limit, transactions]);
  
  return (
    <Card>
      <Card.Content>
        <Card.Title title="Most expensive transactions" titleVariant="titleLarge" />
        {mostExpensiveTransactions.slice(0, limit).map((transaction) => (
          <Card.Content key={transaction.id} style={styles.trxnItem}>
            <Text variant="titleMedium">{transaction.title}</Text>
            <Text variant="bodyMedium">{transaction.details}</Text>
            <Text variant="bodyMedium">{transaction.registeredAt.toLocaleDateString()}</Text>
            <Text variant="bodyMedium">Total: {`${CURRENCY_SYMBOLS[account.currency]} ${transaction.amount.toFixed(2)}`}</Text>
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
