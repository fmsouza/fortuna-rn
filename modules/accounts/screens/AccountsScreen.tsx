import { Link } from 'expo-router';
import { Button } from 'react-native';

import { Container, IconButton, Text } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';
import { makeStyles } from '~/theme';
import { NewAccountModal } from '../modals';
import { useState } from 'react';

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
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);

  useHeaderOptions({
    title: 'Accounts',
    headerLeft: () => (
      <Link href="/settings" asChild>
        <Button title='Settings' />
      </Link>
    ),
    headerRight: () => (
      <IconButton name='plus' color='#0070E0' onPress={() => setShowNewAccountModal(true)} />
    ),
  });

  return (
    <Container style={styles.container}>
      <Text>ACCOUNTS PAGE</Text>
      <NewAccountModal
        isOpen={showNewAccountModal}
        onDismiss={() => setShowNewAccountModal(false)}
      />
    </Container>
  );
}
