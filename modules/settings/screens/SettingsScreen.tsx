import { Text, View } from 'react-native';

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

export function SettingsScreen() {
  const styles = useStyles();

  useHeaderOptions({
    title: 'Settings',
  });

  return (
    <View style={styles.container}>
      <Text>SETTINGS PAGE</Text>
    </View>
  );
}
