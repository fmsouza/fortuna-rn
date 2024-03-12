import { StyleSheet, Text, View } from 'react-native';

import { useHeaderOptions } from '~/shared/hooks';

export function SettingsScreen() {
  useHeaderOptions({
    title: 'Settings',
  });

  return (
    <View style={styles.container}>
      <Text>SETTINGS PAGE</Text>
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
