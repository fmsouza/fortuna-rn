import { ProgressBar, Snackbar } from 'react-native-paper';

import { makeStyles } from '~/theme';
import { Container, HeaderButton } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';

import { useAccountDetailsScreenState } from './useAccountDetailsScreenState';
import { Overview } from './Overview';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1
  },
}));

export function AccountDetailsScreen() {
  const styles = useStyles();
  const state = useAccountDetailsScreenState();

  useHeaderOptions({
    title: state.account?.title ?? '',
    headerRight: () => (
      <HeaderButton title="Add" icon="plus" link={`/import-transactions/${state.account?.id}`} />
    ),
  });

  return (
    <Container style={styles.container}>
      {state.loading && <ProgressBar indeterminate />}
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>{state.error?.message}</Snackbar>
      {state.account && (
        <Overview
          account={state.account!}
          canGoToNextMonth={state.canGoToNextMonth}
          canGoToPreviousMonth={state.canGoToPreviousMonth}
          period={state.currentPeriod}
          periods={state.periods}
          onChangePeriod={state.handleChangePeriod}
          onPressAddTransactions={state.handlePressAddTransactions}
        />
      )}
    </Container>
  );
}
