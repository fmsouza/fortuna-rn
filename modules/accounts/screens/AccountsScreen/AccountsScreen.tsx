import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import { ProgressBar, Snackbar } from 'react-native-paper';

import { makeStyles } from '~/theme';
import { Container, HeaderButton, NoItems } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';
import { useAccounts } from '~/modules/accounts/hooks';

import { AccountItem } from './AccountItem';

const useStyles = makeStyles((theme) => ({
  row: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: theme.dimensions.padding * 2
  },
}));

export function AccountsScreen() {
  const styles = useStyles();
  const {accounts, loading, error} = useAccounts();

  useHeaderOptions({
    title: 'Accounts',
    headerLeft: () => (
      <HeaderButton title="Settings" icon="cog" link="/settings" />
    ),
    headerRight: () => (
      <HeaderButton title="Add" icon="plus" link="/new-account" />
    ),
  });

  return (
    <Container>
      {loading && <ProgressBar indeterminate />}
      <Snackbar visible={error !== null} onDismiss={() => {}}>{error?.message}</Snackbar>

      {!loading && accounts.length === 0 && <NoItems message='Nothing to see yet. Start adding new accounts to make this page more interesting!' />}
      {accounts.map((account) => (
        <Link key={account.id} href={`/account/${account.id}`} asChild>
          <Pressable style={styles.row}>
            <AccountItem account={account} />
          </Pressable>
        </Link>
      ))}
    </Container>
  );
}
