import { Link } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useHeaderOptions } from '~/shared/hooks';

export function AccountsScreen() {
  useHeaderOptions({
    title: 'Accounts',
    headerLeft: () => (
      <Link href="/settings" asChild>
        <Button title='Settings' />
      </Link>
    ),
    headerRight: () => (
      <Link href="/accounts/new" asChild>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
