import { FlatList, View } from "react-native";
import { Button, ProgressBar, Snackbar, Text } from "react-native-paper";

import { makeStyles } from "~/theme";
import { Container, HeaderButton } from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";
import { TransactionItem } from "~/modules/transactions/components";
import { Transaction } from "~/modules/transactions/types";

import { UpsertTransactionModal } from "~/modules/transactions/modals";

import { useImportTransactionsScreenState } from "./useImportTransactionsScreenState";
import { ReviewUncategorizedTransactions } from "./ReviewUncaterorizedTransactions";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    paddingTop: theme.dimensions.padding(2)
  },
  topButtonRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topDividerText: {
    paddingTop: theme.dimensions.padding(2),
    fontSize: theme.fonts.bodyLarge.fontSize,
  },
  bottomButtonRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.dimensions.padding(2)
  },
  itemRow: {
    marginBottom: theme.dimensions.padding(1),
  },
}));

export function ImportTransactionsScreen() {
  const styles = useStyles();
  const state = useImportTransactionsScreenState();

  useHeaderOptions({
    title: `Import Transactions ${state.transactions.length > 0 ? `(${state.transactions.length})` : ''}`,
    headerRight: () => (
      <HeaderButton title="Save" icon="content-save" onPress={() => {}} />
    ),
  });

  return (
    <Container style={styles.container}>
      {state.loading && <ProgressBar indeterminate />}
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>{state.error?.message}</Snackbar>

      {state.uncategorizedTransactionGroupsCount > 0 && (
        <ReviewUncategorizedTransactions
          onPressReview={state.onPressReviewUncategorizedTransactions}
          uncategorizedTransactionGroupsCount={state.uncategorizedTransactionGroupsCount}
          transactionsCount={state.uncategorizedTransactionsCount}
        />
      )}

      <FlatList
        data={state.transactions}
        keyExtractor={(item) => item.externalId!}
        ListEmptyComponent={
          <View style={styles.topButtonRow}>
            <Button icon="file-download-outline" mode="contained" onPress={state.onPressImport}>
              Import from CSV
            </Button>
            <Text style={styles.topDividerText}>or</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <TransactionItem
              currency={state.account?.currency!}
              transaction={item as Transaction}
              onEdit={() => state.onPressEditTransaction(index)}
              onRemove={() => state.onPressRemoveTransaction(index)}
              onUpdateCategory={(categoryId) => state.onUpdateTransactionCategory(index, categoryId)}
            />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.bottomButtonRow}>
            <Button icon="plus" mode="contained" onPress={state.onPressAddAnotherTransaction}>
              Add another transaction
            </Button>
          </View>
        }
      />
      {state.showUpsertTransactionModal && (
        <UpsertTransactionModal
          currency={state.account?.currency!}
          onDismiss={state.onDismissUpsertTransactionModal}
          transaction={state.selectedTransaction}
          visible={state.showUpsertTransactionModal}
        />
      )}
    </Container>
  );
}