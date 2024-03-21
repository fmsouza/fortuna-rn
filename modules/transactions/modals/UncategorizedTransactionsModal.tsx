import { useState } from "react";
import { FlatList } from "react-native";
import { Card } from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { Modal } from "~/modules/shared/components";

import { StandardTransactionCategory } from "../constants";
import { CategorySelect } from "../components";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    backgroundColor: theme.colors.background,
    margin: theme.dimensions.spacing(2),
    borderRadius: theme.dimensions.radius(2),
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.dimensions.spacing(1),
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingHorizontal: theme.dimensions.spacing(2),
  },
  listItem: {
    marginVertical: theme.dimensions.spacing(),
  },
}));

type UncategorizedTransactionsModalProps = {
  onDismiss: (updates?: Maybe<Record<string, number>>) => void;
  transactionGroups: Record<string, number>;
  visible: boolean;
};

export function UncategorizedTransactionsModal({
  onDismiss,
  transactionGroups,
  visible,
}: UncategorizedTransactionsModalProps) {
  const styles = useStyles();
  const t = useText();
  const [values, setValues] = useState<Record<string, number>>({});

  const groups = Object.keys(transactionGroups).sort(
    (a, b) => transactionGroups[b] - transactionGroups[a]
  );

  return (
    <Modal visible={visible} onDismiss={onDismiss} style={styles.root}>
      <Modal.Header
        title={t("screens.transactions.actions.reviewCategories")}
        left={
          <Modal.Header.Button
            title={t("common.actions.close")}
            icon="close"
            onPress={onDismiss}
          />
        }
        right={
          <Modal.Header.Button
            title={t("common.actions.save")}
            icon="content-save"
            onPress={() => onDismiss(values)}
          />
        }
      />
      <FlatList
        contentContainerStyle={styles.modalContent}
        data={groups}
        keyExtractor={(_item, index) => String(index)}
        renderItem={({ item }) => (
          <Card style={styles.listItem}>
            <Card.Title
              title={item}
              subtitle={`${transactionGroups[item]} ${pluralize(
                transactionGroups[item],
                "transaction",
                "transactions"
              )} with this title`}
            />
            <Card.Content>
              <CategorySelect
                label={t("screens.transactions.fields.category")}
                placeholder={t("screens.transactions.fields.category")}
                categoryId={values[item] ?? StandardTransactionCategory.UNKNOWN}
                onChange={(categoryId) => {
                  setValues((prev) => ({ ...prev, [item]: categoryId }));
                }}
              />
            </Card.Content>
          </Card>
        )}
      />
    </Modal>
  );
}

const pluralize = (count: number, singular: string, plural: string) => {
  return count === 1 ? singular : plural;
};
