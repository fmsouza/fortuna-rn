import { Link } from 'expo-router';
import { Button, Text, View } from 'react-native';

import { useHeaderOptions } from '~/modules/shared/navigation';
import { makeStyles } from '~/theme';

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

  useHeaderOptions({
    title: 'Accounts',
    headerLeft: () => (
      <Link href="/settings" asChild>
        <Button title='Settings' />
      </Link>
    ),
    headerRight: () => (
      <Link href="/new-account" asChild>
        <Button title='+' />
      </Link>
    ),
  });

  return (
    <View style={styles.container}>
      <Text>ACCOUNTS PAGE</Text>
    </View>
  );
}
