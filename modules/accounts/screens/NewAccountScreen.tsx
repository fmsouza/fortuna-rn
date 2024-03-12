import { useRouter } from 'expo-router';
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

export function NewAccountScreen() {
  const router = useRouter();
  const styles = useStyles();
  
  useHeaderOptions({
    title: 'Accounts',
    presentation: 'modal',
    headerRight: () => <Button title='Close' onPress={router.back} />,
  });

  return (
    <View style={styles.container}>
      <Text>NEW ACCOUNT PAGE</Text>
    </View>
  );
}
