import { ActivityIndicator, View } from "react-native";

import { makeStyles, useTheme } from "~/theme";

const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export function LoadingView() {
  const styles = useStyles();
  const theme = useTheme();
  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color={theme.colors.secondary} />
    </View>
  );
}
