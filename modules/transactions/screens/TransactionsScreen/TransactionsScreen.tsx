import { FlatList, View } from "react-native";
import { ProgressBar, Snackbar } from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { useHeaderOptions } from "~/modules/shared/navigation";
import { Container, Dialog, NoItems } from "~/modules/shared/components";
import {
  ReviewUncategorizedTransactions,
  TransactionItem,
} from "~/modules/transactions/components";
import {
  UncategorizedTransactionsModal,
  UpsertTransactionSheet,
} from "~/modules/transactions/modals";

import { useTransactionsScreenState } from "./useTransactionsScreenState";

const useStyles = makeStyles((theme) => ({
  listContainer: {
    paddingHorizontal: theme.dimensions.spacing(),
  },
  row: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: theme.dimensions.spacing(2),
  },
}));

export function TransactionsScreen() {
  const styles = useStyles();
  const t = useText();
  const state = useTransactionsScreenState();

  useHeaderOptions({
    title: t("screens.transactions.title"),
  });

  return (
    <Container>
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>
        {state.error?.message}
      </Snackbar>
      {state.loading ? (
        <ProgressBar indeterminate />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={state.transactions}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={
            state.uncategorizedTransactionsCount === 0 ? null : (
              <View style={styles.row}>
                <ReviewUncategorizedTransactions
                  onPressReview={state.onPressUncategorizedTransactions}
                  transactionsCount={state.uncategorizedTransactionsCount}
                  uncategorizedTransactionGroupsCount={
                    Object.keys(state.uncategorizedTransactionGroups).length
                  }
                />
              </View>
            )
          }
          ListEmptyComponent={
            <NoItems message={t("screens.transactions.noTransactions")} />
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <TransactionItem
                key={item.id}
                currency={state.account!.currency}
                onEdit={() => state.onPressEditTransaction(item)}
                onRemove={() => state.onPressRemoveTransaction(item)}
                onUpdateCategory={(categoryId) =>
                  state.onChangeTransactionCategory(item, categoryId)
                }
                transaction={item}
              />
            </View>
          )}
        />
      )}
      {state.showRemoveAlert && (
        <Dialog
          visible
          title={t("screens.transactions.deleteTransactionDialog.title")}
          description={t(
            "screens.transactions.deleteTransactionDialog.content"
          )}
          onConfirm={state.handleRemoveSelectedTransaction}
          onDismiss={state.handleDismissRemoveAlert}
        />
      )}
      {state.showEditTransactionModal && (
        <UpsertTransactionSheet
          currency={state.account?.currency!}
          onDismiss={state.handleDismissEditTransactionModal}
          transaction={state.selectedTransaction}
          visible
        />
      )}
      {state.showUncategorizedTransactionsModal && (
        <UncategorizedTransactionsModal
          onDismiss={state.handleDismissUncategorizedTransactionsModal}
          transactionGroups={state.uncategorizedTransactionGroups}
          visible
        />
      )}
    </Container>
  );
}
