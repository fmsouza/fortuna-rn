import { View } from 'react-native';

import { Container } from '~/modules/shared/components';
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
    <Container style={styles.container}>
      <View />
    </Container>
  );
}
