import { View } from "react-native";
import { Icon, Surface, Text, useTheme } from "react-native-paper";

import { useText } from "~/intl";
import { Theme, makeStyles } from "~/theme";

import { BackupProvider } from "./useSettingsBackupRestoreScreenState";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    padding: theme.dimensions.spacing(2),
    width: "100%",
    height: "100%",
  },
  contentBlock: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  backupDateLabel: {
    color: theme.colors.shadow,
  },
}));

type ProviderItemProps = {
  provider: BackupProvider;
};

export function ProviderItem({ provider }: ProviderItemProps) {
  const styles = useStyles();
  const theme = useTheme() as Theme;
  const t = useText();

  return (
    <Surface style={styles.root}>
      <View style={styles.contentBlock}>
        <Icon source={provider.icon} color={theme.colors.primary} size={48} />
      </View>
      <View style={styles.contentBlock}>
        <Text variant="labelLarge">{provider.title}</Text>
      </View>
      <View style={styles.contentBlock}>
        <Text variant="labelSmall" style={styles.backupDateLabel}>
          {t("screens.backupRestore.lastBackupAt")}
        </Text>
        <Text variant="labelSmall" style={styles.backupDateLabel}>
          {provider.lastBackupAt?.toLocaleDateString() ??
            t("screens.backupRestore.never")}
        </Text>
      </View>
    </Surface>
  );
}
