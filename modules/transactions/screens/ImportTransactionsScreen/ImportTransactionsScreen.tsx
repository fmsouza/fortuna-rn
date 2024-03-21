import { FlatList, View } from "react-native";
import { Button, ProgressBar, Snackbar, Text } from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { Container, HeaderButton } from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";
import { Transaction } from "~/modules/transactions/types";
import {
  TransactionItem,
  ReviewUncategorizedTransactions,
} from "~/modules/transactions/components";
import {
  UncategorizedTransactionsModal,
  UpsertTransactionSheet,
} from "~/modules/transactions/modals";

import { useImportTransactionsScreenState } from "./useImportTransactionsScreenState";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
  },
  topButtonRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: theme.dimensions.spacing(2),
  },
  topDividerText: {
    paddingTop: theme.dimensions.spacing(2),
    fontSize: theme.fonts.bodyLarge.fontSize,
  },
  bottomButtonRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.dimensions.spacing(2),
  },
  itemRow: {
    paddingBottom: theme.dimensions.spacing(1),
  },
}));

export function ImportTransactionsScreen() {
  const styles = useStyles();
  const t = useText();
  const state = useImportTransactionsScreenState();

  useHeaderOptions({
    title: t("screens.transactions.importTransactionsCount", {
      count: String(state.transactions.length),
    }),
    headerRight: () => (
      <HeaderButton
        title={t("common.actions.save")}
        icon="content-save"
        onPress={state.onSaveTransactions}
      />
    ),
  });

  return (
    <Container style={styles.container}>
      {state.loading && <ProgressBar indeterminate />}
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>
        {state.error?.message}
      </Snackbar>

      <FlatList
        data={state.transactions}
        keyExtractor={(item, index) => [item.externalId!, index].join("-")}
        ListHeaderComponent={
          state.uncategorizedTransactionGroupsCount === 0 ? null : (
            <View style={styles.itemRow}>
              <ReviewUncategorizedTransactions
                onPressReview={state.onPressReviewUncategorizedTransactions}
                uncategorizedTransactionGroupsCount={
                  state.uncategorizedTransactionGroupsCount
                }
                transactionsCount={state.uncategorizedTransactionsCount}
              />
            </View>
          )
        }
        ListEmptyComponent={
          <View style={styles.topButtonRow}>
            <Button
              icon="file-download-outline"
              mode="contained"
              onPress={state.onPressImport}
            >
              {t("screens.transactions.importFrom", { source: "CSV" })}
            </Button>
            <Text style={styles.topDividerText}>
              {t("screens.transactions.or")}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <TransactionItem
              currency={state.account?.currency!}
              transaction={item as Transaction}
              onEdit={() => state.onPressEditTransaction(index)}
              onRemove={() => state.onPressRemoveTransaction(index)}
              onUpdateCategory={(categoryId) =>
                state.onUpdateTransactionCategory(index, categoryId)
              }
            />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.bottomButtonRow}>
            <Button
              icon="plus"
              mode="contained"
              onPress={state.onPressAddAnotherTransaction}
            >
              {t("screens.transactions.actions.addAnotherTransaction")}
            </Button>
          </View>
        }
      />
      {state.showUpsertTransactionSheet && (
        <UpsertTransactionSheet
          currency={state.account?.currency!}
          onDismiss={state.onDismissUpsertTransactionSheet}
          transaction={state.selectedTransaction}
          visible={state.showUpsertTransactionSheet}
        />
      )}
      {state.showUncategorizedTransactionsModal && (
        <UncategorizedTransactionsModal
          onDismiss={state.onDismissReviewUncategorizedTransactions}
          transactionGroups={state.uncategorizedTransactionGroups}
          visible
        />
      )}
    </Container>
  );
}
