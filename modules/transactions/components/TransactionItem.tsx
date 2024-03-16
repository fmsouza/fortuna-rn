import { List } from "react-native-paper";

import { makeStyles } from "~/theme";

import { Transaction } from "../types";

type TransactionItemProps = {
  transaction: Partial<Transaction>;
};

const useStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

export function TransactionItem({ transaction }: TransactionItemProps) {
  const styles = useStyles();

  return (
    <List.Item
      style={styles.container}
      title={transaction.title}
      description={transaction.registeredAt?.toDateString()}
    />
  );
}