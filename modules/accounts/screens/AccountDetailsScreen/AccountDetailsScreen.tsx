import { makeStyles } from '~/theme';
import { Container, HeaderButton, SwiperView } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';

import { useAccountDetailsScreenState } from './useAccountDetailsScreenState';
import { NoTransactions } from './NoTransactions';
import { MonthOverview } from './MonthOverview';
import { AllTimeInsights } from './AllTimeInsights';

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
      <HeaderButton title="Add" icon="plus" link="/import-transactions" />
    ),
  });

  return (
    <Container style={styles.container}>
      <SwiperView
        activeItem={state.currentPeriod?.toISOString() ?? 'all'}
        items={state.periods}
        onChangeActiveItem={state.handleChangePeriod}
        renderScreen={(_item, index) => (
          <Container key={index} style={styles.container}>
            {state.showList && (
              <>
                {state.transactions.length === 0 ?
                  <NoTransactions onPressAddTransactions={state.handlePressAddTransactions} />
                : state.currentPeriod ? 
                  <MonthOverview account={state.account!} currentPeriod={state.currentPeriod} transactions={state.transactions} />
                : <AllTimeInsights account={state.account!} transactions={state.transactions} />
                }
              </>
            )}
          </Container>
        )}
      />
    </Container>
  );
}
