import { View } from 'react-native';

import { makeStyles } from '~/theme';
import { Account } from '~/modules/accounts/types';
import { CategoryPieView, MonthlyBarView, MostRecurringExpensesView, TopCategoryExpensesView } from '~/modules/transactions/components';
import { Transaction } from '~/modules/transactions/types';

const useStyles = makeStyles((theme) => ({
  row: {
    marginBottom: theme.dimensions.spacing(),
  },
}));

type AllTimeInsightsProps = {
  account: Account;
  transactions: Transaction[];
};

export function AllTimeInsights({account, transactions}: AllTimeInsightsProps) {
  const styles = useStyles();
  return (
    <>
    <View style={styles.row}>
      <MonthlyBarView account={account} transactions={transactions} />
    </View>
    <View style={styles.row}>
      <CategoryPieView transactions={transactions} />
    </View>
    <View style={styles.row}>
      <TopCategoryExpensesView transactions={transactions} />
    </View>
    <View style={styles.row}>
      <MostRecurringExpensesView account={account} transactions={transactions} />
    </View>
    </>
  );
};