import { Link } from "expo-router";
import { Button, Card, Text } from "react-native-paper";

import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { Account } from "~/modules/accounts/types";
import { CURRENCY_SYMBOLS } from "~/modules/accounts/constants";
import { Transaction } from "~/modules/transactions/types";

const TRANSACTIONS_LIST_SIZE = 2;

const useStyles = makeStyles((theme) => ({
  trxnItem: {
    paddingVertical: theme.dimensions.spacing(),
  },
}));

type TransactionsListViewProps = {
  account: Account;
  period?: Maybe<Date>;
  transactions: Transaction[];
};

export function TransactionsListView({ account, period, transactions }: TransactionsListViewProps) {
  const styles = useStyles();

  const viewMoreLink = `/account/${account.id}/transactions${period ? `?period=${period.toISOString()}` : ''}`;
  
  return (
    <Card>
      <Card.Content>
        <Card.Title title={`Transactions (${transactions.length})`} titleVariant="titleLarge" />
        {transactions.slice(0, TRANSACTIONS_LIST_SIZE).map((transaction) => (
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
