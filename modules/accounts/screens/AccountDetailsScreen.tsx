import { useLocalSearchParams } from 'expo-router';

import { makeStyles } from '~/theme';
import { Container } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';
import { useAccount } from '~/modules/accounts/hooks';
import { View } from 'react-native';

const useStyles = makeStyles((theme) => ({
  container: {
  },
}));

export function AccountDetailsScreen() {
  const styles = useStyles();
  const { accountId } = useLocalSearchParams();
  const { account } = useAccount(Number(accountId));

  useHeaderOptions({
    title: account?.title || '',
  });

  return (
    <Container style={styles.container}>
      <View />
    </Container>
  );
}
