import { FlatList, TouchableOpacity, View } from "react-native";
import { ProgressBar, SegmentedButtons, Snackbar } from "react-native-paper";

import { makeStyles } from "~/theme";
import { Container, Dialog } from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";

import {
  Operation,
  useSettingsBackupRestoreScreenState,
} from "./useSettingsBackupRestoreScreenState";
import { ProviderItem } from "./ProviderItem";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    flex: 1,
    paddingHorizontal: theme.dimensions.spacing(),
  },
  segmentRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: theme.dimensions.spacing(2),
    maxWidth: "75%",
  },
  providersList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    flex: 1,
  },
  providersContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    paddingHorizontal: theme.dimensions.spacing(2),
  },
  providerItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: theme.dimensions.spacing(),
    height: 160,
  },
}));

export function BackupRestoreScreen() {
  const styles = useStyles();
  const { t, ...state } = useSettingsBackupRestoreScreenState();

  useHeaderOptions({
    title: t("screens.backupRestore.title"),
  });

  return (
    <Container style={styles.container}>
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>
        {state.error?.message}
      </Snackbar>
      {state.loading && <ProgressBar indeterminate />}
      <View style={styles.segmentRow}>
        <SegmentedButtons
          density="medium"
          buttons={[
            {
              value: Operation.BACKUP,
              label: t("screens.backupRestore.actions.backup"),
            },
            {
              value: Operation.RESTORE,
              label: t("screens.backupRestore.actions.restore"),
            },
          ]}
          value={state.activeOperation}
          onValueChange={(operation: string) =>
            state.handleOperationChange(operation as Operation)
          }
        />
      </View>
      <View style={styles.providersList}>
        <FlatList
          contentContainerStyle={styles.providersContainer}
          data={state.providers}
          numColumns={2}
          keyExtractor={(item, index) => item?.id ?? index.toString()}
          renderItem={({ item }) => (
            <View style={styles.providerItem}>
              {item && (
                <TouchableOpacity
                  style={{ width: "100%", height: "100%" }}
                  onPress={() => state.handleProviderPress(item.id)}
                >
                  <ProviderItem provider={item} />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      </View>
      {state.showOperationConfirmationDialog && (
        <Dialog
          visible
          title={t(
            `screens.backupRestore.operationConfirmationDialog.${state.activeOperation}.title`,
            {
              provider: state.selectedProvider!.title,
            }
          )}
          description={t(
            `screens.backupRestore.operationConfirmationDialog.${state.activeOperation}.content`
          )}
          onConfirm={state.handleOperationConfirm}
          onDismiss={state.handleOperationDismiss}
        />
      )}
    </Container>
  );
}
