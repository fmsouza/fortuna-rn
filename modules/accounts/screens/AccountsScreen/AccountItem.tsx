import { useMemo } from "react";
import { View } from "react-native";

import { makeStyles } from "~/theme";
import { Text } from "~/modules/shared/components";
import { Account } from "~/modules/accounts/types";
import { CURRENCY_SYMBOLS } from "~/modules/accounts/constants";
import { useTransactions } from "~/modules/transactions/hooks";
import { aggregateByType } from "~/modules/transactions/utils";

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.dimensions.padding * 2,
    borderRadius: theme.dimensions.border,
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: theme.text.baseSize * 1.3,
  },
  balance: {
    fontSize: theme.text.baseSize * 1.3,
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
      <Text style={styles.name}>{account.title}</Text>
      <Text style={styles.balance}>
        {CURRENCY_SYMBOLS[account.currency]} {balance.toFixed(2)}
      </Text>
    </View>
  );
}