import {
  List,
  ProgressBar,
  Snackbar,
  Switch,
  useTheme,
} from "react-native-paper";

import { makeStyles } from "~/theme";
import { Container } from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";

import pkg from "../../../package.json";
import { useAppPreference, useSaveAppPreference } from "../hooks";
import { AppPreferences } from "../constants";
import { useCallback } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    flex: 1,
    paddingHorizontal: theme.dimensions.spacing(),
  },
}));

export function SettingsScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const { appPreference: darkModePreference } = useAppPreference(
    AppPreferences.DARK_MODE
  );
  const { saveAppPreference, error, loading } = useSaveAppPreference();

  const isDarkModeEnabled = Boolean(darkModePreference?.value);

  const handleDarkModeChange = useCallback(() => {
    saveAppPreference({
      id: AppPreferences.DARK_MODE,
      value: isDarkModeEnabled ? null : "true",
    });
  }, [isDarkModeEnabled, saveAppPreference]);

  useHeaderOptions({
    title: "Settings",
  });

  return (
    <Container style={styles.container}>
      <Snackbar visible={error !== null} onDismiss={() => {}}>
        {error?.message}
      </Snackbar>
      {loading && <ProgressBar indeterminate />}

      <List.Section>
        <List.Subheader>General</List.Subheader>
        <List.Item
          title="Enable dark mode"
          left={() => <List.Icon icon="brightness-4" />}
          right={(props) => (
            <Switch
              {...props}
              color={theme.colors.primary}
              value={isDarkModeEnabled}
              onChange={handleDarkModeChange}
            />
          )}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item
          titleStyle={{ fontSize: 12 }}
          title={`Fortuna © ${new Date().getFullYear()}`}
        />
        <List.Item
          titleStyle={{ fontSize: 12 }}
          title={`Version: ${pkg.version}`}
        />
      </List.Section>
    </Container>
  );
}
