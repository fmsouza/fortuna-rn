import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

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
    padding: theme.dimensions.padding(2),
    borderRadius: theme.dimensions.border(),
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.backdrop,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    <View style={styles.container}>
      <Text variant="bodyLarge">{account.title}</Text>
      <Text variant="bodyLarge">
        {CURRENCY_SYMBOLS[account.currency]} {balance.toFixed(2)}
      </Text>
    </View>
  );
}