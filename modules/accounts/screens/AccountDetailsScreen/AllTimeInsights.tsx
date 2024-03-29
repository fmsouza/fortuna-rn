import { View } from "react-native";
import { ProgressBar, Snackbar } from "react-native-paper";

import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { Account } from "~/modules/accounts/types";
import {
  AverageBalanceView,
  CategoryBreakdownView,
  MonthlyBarView,
  MostRecurringExpensesView,
  TopCategoryExpensesView,
} from "~/modules/transactions/components";
import { useTransactions } from "~/modules/transactions/hooks";

const useStyles = makeStyles((theme) => ({
  row: {
    marginBottom: theme.dimensions.spacing(),
  },
}));

type AllTimeInsightsProps = {
  account: Account;
  currentPeriod?: Maybe<Date>;
};

export function AllTimeInsights({ account }: AllTimeInsightsProps) {
  const styles = useStyles();
  const { transactions, loading, error } = useTransactions({
    accountId: account.id,
  });

  return (
    <>
      {loading && <ProgressBar indeterminate />}
      <Snackbar visible={error !== null} onDismiss={() => {}}>
        {error?.message}
      </Snackbar>
      <View style={styles.row}>
        <MonthlyBarView account={account} transactions={transactions} />
      </View>
      <View style={styles.row}>
        <AverageBalanceView transactions={transactions} />
      </View>
      <View style={styles.row}>
        <TopCategoryExpensesView transactions={transactions} />
      </View>
      <View style={styles.row}>
        <CategoryBreakdownView transactions={transactions} />
      </View>
      <View style={styles.row}>
        <MostRecurringExpensesView
          account={account}
          transactions={transactions}
        />
      </View>
    </>
  );
}
