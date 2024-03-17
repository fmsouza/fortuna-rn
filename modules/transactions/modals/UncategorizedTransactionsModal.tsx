import { useState } from "react";
import { FlatList, View } from "react-native";
import { Card, Modal, Text } from "react-native-paper";

import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { HeaderButton } from "~/modules/shared/components";

import { StandardTransactionCategory } from "../constants";
import { CategorySelect } from "../components";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.background,
    margin: theme.dimensions.padding(2),
    borderRadius: theme.dimensions.radius(2),
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.dimensions.padding(1),
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: theme.dimensions.padding(2),
  },
  listItem: {
    marginVertical: theme.dimensions.padding(),
  },
}));

type UncategorizedTransactionsModalProps = {
  onDismiss: (updates?: Maybe<Record<string, number>>) => void;
  transactionGroups: Record<string, number>;
};

export function UncategorizedTransactionsModal({ onDismiss, transactionGroups }: UncategorizedTransactionsModalProps) {
  const styles = useStyles();
  const [values, setValues] = useState<Record<string, number>>({});

  const groups = Object.keys(transactionGroups).sort((a, b) => transactionGroups[b] - transactionGroups[a]);

  return (
    <Modal visible onDismiss={() => onDismiss()} style={{ maxHeight: '90%'}} contentContainerStyle={styles.root} dismissableBackButton dismissable>
      <View style={styles.modalHeader}>
        <View>
          <HeaderButton title="Cancel" icon="close" onPress={() => onDismiss()} />
        </View>
        <Text variant="titleMedium">Review Categories</Text>
        <View>
          <HeaderButton title="Save" icon="content-save" onPress={() => onDismiss(values)} />
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.modalContent}
        data={groups}
        keyExtractor={(_item, index) => String(index)}
        renderItem={({ item }) => (
          <Card style={styles.listItem}>
            <Card.Title title={item} subtitle={`${transactionGroups[item]} ${pluralize(transactionGroups[item], 'transaction', 'transactions')} with this title`} />
            <Card.Content>
              <CategorySelect
                label="Category"
                placeholder="Category"
                categoryId={values[item] ?? StandardTransactionCategory.OTHER}
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
}