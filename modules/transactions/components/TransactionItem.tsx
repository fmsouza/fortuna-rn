import { View } from "react-native";
import { Button, List, Surface, Text } from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { CURRENCY_SYMBOLS, Currency } from "~/modules/accounts/constants";
import { Transaction } from "~/modules/transactions/types";
import { TransactionType } from "~/modules/transactions/constants";

import { CategorySelect } from "./CategorySelect";

const useStyles = makeStyles((theme) => ({
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.dimensions.spacing(1),
  },
  categoryRow: {
    display: "flex",
    padding: theme.dimensions.spacing(),
  },
}));

type TransactionItemProps = {
  currency: Currency;
  onEdit?: () => void;
  onRemove?: () => void;
  onUpdateCategory: (categoryId: number) => void;
  transaction: Transaction;
};

export function TransactionItem({
  currency,
  onEdit,
  onRemove,
  onUpdateCategory,
  transaction,
}: TransactionItemProps) {
  const styles = useStyles();
  const t = useText();

  const isIncome = transaction.type === TransactionType.INCOME;

  return (
    <Surface>
      <List.Accordion
        left={(props) => (
          <List.Icon
            {...props}
            icon={isIncome ? "trending-up" : "trending-down"}
            color={isIncome ? "green" : "red"}
          />
        )}
        title={transaction.title}
        description={`${
          CURRENCY_SYMBOLS[currency]
        } ${transaction.amount?.toFixed(2)}`}
      >
        <View style={styles.categoryRow}>
          <Text variant="labelLarge">
            {t("screens.transactions.fields.category")}
          </Text>
          <CategorySelect
            categoryId={transaction.categoryId}
            onChange={onUpdateCategory}
          />
        </View>

        <List.Item
          title={t("screens.transactions.fields.date")}
          description={new Date(transaction.registeredAt!).toLocaleDateString()}
        />

        {transaction.origin && (
          <List.Item
            title={t("screens.transactions.fields.origin")}
            description={transaction.origin}
          />
        )}

        {transaction.details && (
          <List.Item
            title={t("screens.transactions.fields.details")}
            description={transaction.details}
          />
        )}

        <List.Item
          title={t("screens.transactions.fields.externalId")}
          description={transaction.externalId}
        />

        <View style={styles.buttonRow}>
          {onEdit && (
            <Button mode="text" onPress={onEdit}>
              {t("common.actions.edit")}
            </Button>
          )}
          {onRemove && (
            <Button mode="text" onPress={onRemove}>
              {t("common.actions.remove")}
            </Button>
          )}
        </View>
      </List.Accordion>
    </Surface>
  );
}
