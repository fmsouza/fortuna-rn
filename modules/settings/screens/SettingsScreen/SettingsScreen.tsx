import {
  List,
  ProgressBar,
  Snackbar,
  Switch,
  useTheme,
} from "react-native-paper";

import { makeStyles } from "~/theme";
import { Container, Dialog, Dropdown } from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";

import pkg from "../../../../package.json";
import { useSettingsScreenState } from "./useSettingsScreenState";
import { useText } from "~/intl";

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
  const state = useSettingsScreenState();
  const t = useText();

  useHeaderOptions({
    title: "Settings",
  });

  return (
    <Container style={styles.container}>
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>
        {state.error?.message}
      </Snackbar>
      {state.loading && <ProgressBar indeterminate />}

      <List.Section>
        <List.Subheader>General</List.Subheader>
        <List.Item
          title="Language settings"
          left={() => <List.Icon icon="comment-text-multiple-outline" />}
          right={() => (
            <Dropdown
              mode="flat"
              underlineColor="transparent"
              outlineColor="transparent"
              style={{ height: 40, backgroundColor: theme.colors.surface }}
              value={state.selectedLanguage}
              options={state.languages}
              onChange={state.changeLanguage}
            />
          )}
        />
        <List.Subheader>{t("hello")}</List.Subheader>
        <List.Item
          title="Enable dark mode"
          left={() => <List.Icon icon="brightness-4" />}
          right={(props) => (
            <Switch
              {...props}
              color={theme.colors.primary}
              value={state.isDarkModeEnabled}
              onChange={state.handleDarkModeChange}
            />
          )}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>Data & Storage</List.Subheader>
        <List.Item
          title="Backup/Restore your data"
          left={() => <List.Icon icon="database-sync-outline" />}
        />
        <List.Item
          title="Reset app data"
          left={() => <List.Icon icon="delete-forever-outline" />}
          onPress={state.handleShowResetAllDataDialog}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item
          title="Terms of use"
          left={() => <List.Icon icon="file-document-multiple-outline" />}
        />
        <List.Item
          title="Privacy Policy"
          left={() => <List.Icon icon="security" />}
        />
        <List.Item
          titleStyle={{ fontSize: 12 }}
          title={`Fortuna © ${new Date().getFullYear()}`}
        />
        <List.Item
          titleStyle={{ fontSize: 12 }}
          title={`Version: ${pkg.version}`}
        />
      </List.Section>
      {state.showResetAllDataDialog && (
        <Dialog
          visible
          title="Reset all data"
          description="Are you sure you want to reset all data? This action cannot be undone."
          onConfirm={state.handleResetAllData}
          onDismiss={state.handleDismissResetAllDataDialog}
        />
      )}
    </Container>
  );
}
