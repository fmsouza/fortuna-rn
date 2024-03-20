import {
  List,
  ProgressBar,
  Snackbar,
  Switch,
  useTheme,
} from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { useHeaderOptions } from "~/modules/shared/navigation";
import { Container, Dialog, Dropdown } from "~/modules/shared/components";

import pkg from "../../../../package.json";
import { useSettingsScreenState } from "./useSettingsScreenState";

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
    title: t("screens.settings.title"),
  });

  return (
    <Container style={styles.container}>
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>
        {state.error?.message}
      </Snackbar>
      {state.loading && <ProgressBar indeterminate />}

      <List.Section>
        <List.Subheader>
          {t("screens.settings.sections.general.title")}
        </List.Subheader>
        <List.Item
          title={t("screens.settings.sections.general.fields.languageSettings")}
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
        <List.Item
          title={t("screens.settings.sections.general.fields.enableDarkMode")}
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
        <List.Subheader>
          {t("screens.settings.sections.storage.title")}
        </List.Subheader>
        <List.Item
          title={t("screens.settings.sections.storage.fields.backupRestore")}
          left={() => <List.Icon icon="database-sync-outline" />}
        />
        <List.Item
          title={t("screens.settings.sections.storage.fields.resetApp")}
          left={() => <List.Icon icon="delete-forever-outline" />}
          onPress={state.handleShowResetAllDataDialog}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>
          {t("screens.settings.sections.about.title")}
        </List.Subheader>
        <List.Item
          title={t("screens.settings.sections.about.fields.useTerms")}
          left={() => <List.Icon icon="file-document-multiple-outline" />}
        />
        <List.Item
          title={t("screens.settings.sections.about.fields.privacyPolicy")}
          left={() => <List.Icon icon="security" />}
        />
        <List.Item
          title={`Fortuna © ${new Date().getFullYear()}`}
          titleStyle={{ fontSize: 12 }}
        />
        <List.Item
          title={t("screens.settings.sections.appVersion", {
            version: pkg.version,
          })}
          titleStyle={{ fontSize: 12 }}
        />
      </List.Section>
      {state.showResetAllDataDialog && (
        <Dialog
          visible
          title={t("screens.settings.resetAllDataDialog.title")}
          description={t("screens.settings.resetAllDataDialog.content")}
          onConfirm={state.handleResetAllData}
          onDismiss={state.handleDismissResetAllDataDialog}
        />
      )}
    </Container>
  );
}
