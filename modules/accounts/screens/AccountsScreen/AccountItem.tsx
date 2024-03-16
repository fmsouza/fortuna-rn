import { useMemo } from "react";
import { List } from "react-native-paper";

import { makeStyles } from "~/theme";
import { Account } from "~/modules/accounts/types";
import { CURRENCY_SYMBOLS } from "~/modules/accounts/constants";
import { useTransactions } from "~/modules/transactions/hooks";
import { aggregateByType } from "~/modules/transactions/utils";

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

type AccountItemProps = {
  account: Account;
};

export function AccountItem({ account }: AccountItemProps) {
  const styles = useStyles();
  const {transactions} = useTransactions({
    accountId: account.id
  });
  
  const balance = useMemo(() => {
    const { income: incomeAmount, expense: expenseAmount } = aggregateByType(transactions);
    return incomeAmount - expenseAmount;
  }, [transactions]);

  return (
    <List.Item
      style={styles.container}
      title={account.title}
      description={`${CURRENCY_SYMBOLS[account.currency]} ${balance.toFixed(2)}`}
      right={props => <List.Icon {...props} icon="chevron-right" />} />
  );
}