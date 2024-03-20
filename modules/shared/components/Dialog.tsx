import { Button, Dialog as RNPDialog, Text } from "react-native-paper";

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
  return (
    <RNPDialog visible={visible} onDismiss={onDismiss}>
      <RNPDialog.Title>{title}</RNPDialog.Title>
      <RNPDialog.Content>
        <Text variant="bodyMedium">{description}</Text>
      </RNPDialog.Content>
      <RNPDialog.Actions>
        <Button onPress={onDismiss}>Cancel</Button>
        <Button onPress={onConfirm}>Ok</Button>
      </RNPDialog.Actions>
    </RNPDialog>
  );
}
