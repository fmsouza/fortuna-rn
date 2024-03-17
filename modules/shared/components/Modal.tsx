import { Button, StyleSheet, View } from "react-native";
import { IconButton, Modal as RNPModal, Text } from "react-native-paper";

import { makeStyles } from "~/theme";
import { IS_IOS } from "~/modules/shared/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.background,
    margin: theme.dimensions.spacing(2),
    borderRadius: theme.dimensions.radius(2),
  },
  modalHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.dimensions.spacing(1),
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: theme.dimensions.spacing(2),
  },
}));

type ModalProps = {
  children: React.ReactNode;
  onDismiss: () => void;
  style?: any;
  visible: boolean;
};

export function Modal({ children, onDismiss, style, visible }: ModalProps) {
  const styles = useStyles();

  return (
    <RNPModal visible={visible} onDismiss={onDismiss} style={{ maxHeight: '90%'}} contentContainerStyle={StyleSheet.flatten([styles.root, style])}>
      {children}
    </RNPModal>
  );
}

type ModalHeaderProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
  title: string;
};

function ModalHeader({ left, right, title }: ModalHeaderProps) {
  const styles = useStyles();
  return (
    <View style={styles.modalHeader}>
      <View>
        {left}
      </View>
      <Text variant="titleMedium">{title}</Text>
      <View>
        {right}
      </View>
    </View>
  );
}

Modal.Header = ModalHeader;

type ModalHeaderButtonProps = {
  title: string;
  icon: string;
  onPress: () => void;
};

function ModalHeaderButton({ title, icon, onPress }: ModalHeaderButtonProps) {
  return IS_IOS ? <Button title={title} onPress={onPress} /> : <IconButton icon={icon} onPress={onPress} />;
}

ModalHeader.Button = ModalHeaderButton;