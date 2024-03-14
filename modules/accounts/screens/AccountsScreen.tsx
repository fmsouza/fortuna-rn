import { Link } from 'expo-router';
import { Button, Pressable } from 'react-native';

import { makeStyles } from '~/theme';
import { Container, Icon, LoadingView, NoItems, Text } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';
import { IS_IOS } from '~/modules/shared/constants';

import { useAccounts } from '../hooks';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
}));

export function AccountsScreen() {
  const styles = useStyles();
  const {accounts, loading} = useAccounts();

  useHeaderOptions({
    title: 'Accounts',
    headerLeft: () => IS_IOS && (
      <Link href="/settings" asChild>
        <Button title='Settings' />
      </Link>
    ),
    headerRight: () => (
      <Link href="/new-account" asChild>
        <Pressable>
          <Icon name='plus' color='#0070E0' />
        </Pressable>
      </Link>
    ),
  });

  return (
    <Container style={styles.container}>
      {loading && <LoadingView />}
      {!loading && accounts.length === 0 && <NoItems message='Nothing to see yet. Start adding new accounts to make this page more interesting!' />}
      {accounts.map((account) => (
        <Link key={account.id} href={`/account/${account.id}`} asChild>
          <Pressable>
            <Icon name='account' />
            <Text>{account.title}</Text>
          </Pressable>
        </Link>
      ))}
    </Container>
  );
}
