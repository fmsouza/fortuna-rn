import { ProgressBar, Snackbar } from "react-native-paper";

import { makeStyles } from "~/theme";
import { Container, HeaderButton } from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";
import { IS_IOS } from "~/modules/shared/constants";

import { useImportTransactionsScreenState } from "./useImportTransactionsScreenState";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: theme.dimensions.padding(2)
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
    </Container>
  );
}