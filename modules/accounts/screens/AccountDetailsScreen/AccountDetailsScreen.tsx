import { Button, ProgressBar, SegmentedButtons, Snackbar, Text } from 'react-native-paper';

import { makeStyles } from '~/theme';
import { Container, HeaderButton, SwiperView } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';

import { useAccountDetailsScreenState } from './useAccountDetailsScreenState';
import { NoTransactions } from './NoTransactions';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
}));

export function AccountDetailsScreen() {
  const styles = useStyles();
  const state = useAccountDetailsScreenState();

  useHeaderOptions({
    title: state.account?.title ?? '',
    headerRight: () => (
      <HeaderButton title="Add" icon="plus" link="/import-transactions" />
    ),
  });

  return (
    <Container style={styles.container}>
      <SwiperView
        activeItem={state.currentPeriod.toISOString()}
        items={state.periods}
        onChangeActiveItem={state.handleChangePeriod}
        renderScreen={({ value: currentPeriod }, index) => (
          <Container key={index} style={styles.container}>
            {state.showList && (
              <>
                {state.transactions.length === 0 && <NoTransactions onPressAddTransactions={state.handlePressAddTransactions} />}
              </>
            )}
          </Container>
        )}
      />
    </Container>
  );
}
