import { Link } from 'expo-router';
import { FlatList, Pressable } from 'react-native';
import { ProgressBar, Snackbar } from 'react-native-paper';

import { makeStyles } from '~/theme';
import { Container, HeaderButton, NoItems } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';
import { useAccounts } from '~/modules/accounts/hooks';

import { AccountItem } from './AccountItem';

const useStyles = makeStyles((theme) => ({
  listContainer: {
    paddingHorizontal: theme.dimensions.spacing(),
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: theme.dimensions.spacing(2)
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
      <Snackbar visible={error !== null} onDismiss={() => {}}>{error?.message}</Snackbar>
      {loading ? <ProgressBar indeterminate /> : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={accounts}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={<NoItems message='Nothing to see yet. Start adding new accounts to make this page more interesting!' />}
          renderItem={({item}) => (
            <Link href={`/account/${item.id}`} asChild>
              <Pressable style={styles.row}>
                <AccountItem account={item} />
              </Pressable>
            </Link>
          )}
        />
      )}
    </Container>
  );
}
