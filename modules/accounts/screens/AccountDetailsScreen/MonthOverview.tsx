import { View } from 'react-native';

import { makeStyles } from '~/theme';
import { Account } from '~/modules/accounts/types';
import { BalanceView, CategoryPieView, DailyBarViewBarView, IncomeExpenseView, MostRecurringExpensesView, TopTransactionsView, TransactionsListView } from '~/modules/transactions/components';
import { Transaction } from '~/modules/transactions/types';

const useStyles = makeStyles((theme) => ({
  row: {
    marginBottom: theme.dimensions.spacing(),
  },
}));

type MonthOverviewProps = {
  account: Account;
  currentPeriod: Date;
  transactions: Transaction[];
};

export function MonthOverview({account, currentPeriod, transactions}: MonthOverviewProps) {
  const styles = useStyles();
  return (
    <>
    <View style={styles.row}>
      <DailyBarViewBarView transactions={transactions} />
    </View>
    <View style={styles.row}>
      <BalanceView account={account} transactions={transactions} />
    </View>
    <View style={styles.row}>
      <IncomeExpenseView transactions={transactions} />
    </View>
    <View style={styles.row}>
      <CategoryPieView transactions={transactions} />
    </View>
    {transactions.length > 3 && (
      <>
        <View style={styles.row}>
          <TopTransactionsView account={account} limit={3} transactions={transactions} />
        </View>
        <View style={styles.row}>
          <MostRecurringExpensesView account={account} transactions={transactions} />
        </View>
      </>
    )}
    <View style={styles.row}>
      <TransactionsListView account={account} transactions={transactions} period={currentPeriod} />
    </View>
    </>
  );
};