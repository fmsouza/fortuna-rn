import { FlatList, View } from "react-native";
import { Button, PaperProvider, ProgressBar, Snackbar, Text, useTheme } from "react-native-paper";

import { makeStyles } from "~/theme";
import { Container, HeaderButton } from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";
import { IS_IOS } from "~/modules/shared/constants";
import { TransactionItem } from "~/modules/transactions/components";
import { Transaction } from "~/modules/transactions/types";

import { useImportTransactionsScreenState } from "./useImportTransactionsScreenState";
import { ReviewUncategorizedTransactions } from "./ReviewUncaterorizedTransactions";
import { UpsertTransactionModal } from "../../modals";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: theme.dimensions.padding(2)
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRow: {
    marginBottom: theme.dimensions.padding(1),
  },
}));

export function ImportTransactionsScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const state = useImportTransactionsScreenState();

  useHeaderOptions({
    title: `Import Transactions ${state.transactions.length > 0 ? `(${state.transactions.length})` : ''}`,
    presentation: 'modal',
    headerLeft: () => IS_IOS && (
      <HeaderButton title="Close" icon="close" onPress={state.onClose} />
    ),
    headerRight: () => (
      <HeaderButton title="Save" icon="content-save" onPress={() => {}} />
    ),
  });

  return (
    <PaperProvider theme={theme}>
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
            <View style={styles.buttonRow}>
              <Button icon="file-download-outline" mode="contained" onPress={state.onPressImport}>
                Import from CSV
              </Button>
              <Text variant="bodyLarge">or</Text>
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
            <View style={styles.buttonRow}>
              <Button icon="plus" mode="contained" onPress={state.onPressAddAnotherTransaction}>
                Add another transaction
              </Button>
            </View>
          }
        />
      </Container>
      
      {state.showUpsertTransactionModal && (
        <UpsertTransactionModal
          currency={state.account?.currency!}
          onDismiss={state.onDismissUpsertTransactionModal}
          transaction={state.selectedTransaction}
          visible={state.showUpsertTransactionModal}
        />
      )}
    </PaperProvider>
  );
}