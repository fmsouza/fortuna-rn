import { useLocalSearchParams } from 'expo-router';
import { ProgressBar, SegmentedButtons, Snackbar } from 'react-native-paper';

import { makeStyles } from '~/theme';
import { Container, HeaderButton } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';

import { useAccountDetailsScreenState } from './useAccountDetailsScreenState';
import { NoTransactions } from './NoTransactions';

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

export function AccountDetailsScreen() {
  const styles = useStyles();
  const { accountId } = useLocalSearchParams();
  const state = useAccountDetailsScreenState({ accountId: Number(accountId) });

  useHeaderOptions({
    title: state.account?.title ?? '',
    headerRight: () => (
      <HeaderButton title="Add" icon="plus" link="/import-transactions" />
    ),
  });

  return (
    <Container style={styles.container}>
      {state.loading && <ProgressBar indeterminate />}
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>{state.error?.message}</Snackbar>
      {state.showPeriods && (
        <SegmentedButtons
          value={state.currentPeriod?.toISOString() ?? 'all'}
          onValueChange={state.handleChangePeriod}
          buttons={state.periods}
        />
      )}
      {state.showList && (
        <>
          {state.transactions.length === 0 && <NoTransactions onPressAddTransactions={state.handlePressAddTransactions} />}
        </>
      )}
    </Container>
  );
}
