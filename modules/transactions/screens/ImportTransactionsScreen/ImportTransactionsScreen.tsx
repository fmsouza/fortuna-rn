import { FlatList, View } from "react-native";
import { Button, ProgressBar, Snackbar, Text } from "react-native-paper";

import { makeStyles } from "~/theme";
import { Container, HeaderButton } from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";
import { IS_IOS } from "~/modules/shared/constants";
import { TransactionItem } from "~/modules/transactions/components";

import { useImportTransactionsScreenState } from "./useImportTransactionsScreenState";
import { ReviewUncategorizedTransactions } from "./ReviewUncaterorizedTransactions";

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
}));

export function ImportTransactionsScreen() {
  const styles = useStyles();
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
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ListFooterComponent={
          <View style={styles.buttonRow}>
            <Button icon="plus" mode="contained" onPress={state.onPressAddAnotherTransaction}>
              Add another transaction
            </Button>
          </View>
        }
      />

    </Container>
  );
}