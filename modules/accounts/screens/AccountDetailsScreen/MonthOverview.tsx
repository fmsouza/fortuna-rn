import { View } from 'react-native';
import { ProgressBar, Snackbar } from 'react-native-paper';

import { makeStyles } from '~/theme';
import { Account } from '~/modules/accounts/types';
import { periodToDateInterval } from '~/modules/accounts/utils';
import { useTransactions } from '~/modules/transactions/hooks';
import { BalanceView, CategoryPieView, DailyBarViewBarView, IncomeExpenseView, MostRecurringExpensesView, TopTransactionsView, TransactionsListView } from '~/modules/transactions/components';

const useStyles = makeStyles((theme) => ({
  row: {
    marginBottom: theme.dimensions.spacing(),
  },
}));

type MonthOverviewProps = {
  account: Account;
  currentPeriod: Date;
};

export function MonthOverview({account, currentPeriod}: MonthOverviewProps) {
  const styles = useStyles();

  const {transactions, loading, error} = useTransactions({
    accountId: account.id,
    dates: periodToDateInterval(currentPeriod),
  });

  return (
    <>
      {loading && <ProgressBar indeterminate />}
      <Snackbar visible={error !== null} onDismiss={() => {}}>{error?.message}</Snackbar>

      {transactions.length > 0 && (
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
      )}
    </>
  );
};