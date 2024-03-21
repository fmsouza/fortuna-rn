import { ProgressBar, Snackbar } from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { useHeaderOptions } from "~/modules/shared/navigation";
import { Container } from "~/modules/shared/components";

import { useSettingsBackupRestoreScreenState } from "./useSettingsBackupRestoreScreenState";

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

export function BackupRestoreScreen() {
  const styles = useStyles();
  const state = useSettingsBackupRestoreScreenState();
  const t = useText();

  useHeaderOptions({
    title: t("screens.backupRestore.title"),
  });

  return (
    <Container style={styles.container}>
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>
        {state.error?.message}
      </Snackbar>
      {state.loading && <ProgressBar indeterminate />}
    </Container>
  );
}
