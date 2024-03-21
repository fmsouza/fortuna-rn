import { Button, Dialog as RNPDialog, Text } from "react-native-paper";

import { useText } from "~/intl";

type DialogProps = {
  description: string;
  onConfirm: () => void;
  onDismiss: () => void;
  title: string;
  visible: boolean;
};

export function Dialog({
  description,
  onConfirm,
  onDismiss,
  title,
  visible,
}: DialogProps) {
  const t = useText();
  return (
    <RNPDialog visible={visible} onDismiss={onDismiss}>
      <RNPDialog.Title>{title}</RNPDialog.Title>
      <RNPDialog.Content>
        <Text variant="bodyMedium">{description}</Text>
      </RNPDialog.Content>
      <RNPDialog.Actions>
        <Button onPress={onDismiss}>{t("common.actions.cancel")}</Button>
        <Button onPress={onConfirm}>{t("common.actions.ok")}</Button>
      </RNPDialog.Actions>
    </RNPDialog>
  );
}
