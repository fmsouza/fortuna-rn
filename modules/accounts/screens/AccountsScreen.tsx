import { Link } from 'expo-router';
import { Button } from 'react-native';

import { Container, Text } from '~/modules/shared/components';
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
    <Container style={styles.container}>
      <Text>ACCOUNTS PAGE</Text>
    </Container>
  );
}
