import { Modal, View, StyleSheet } from "react-native";
import { ReactNode } from "react";

import { makeStyles, useTheme } from "~/theme";
import { Text } from "./Text";
import { IconButton } from "./Icon";

type ActionSheetProps = {
  style?: any;
  isOpen: boolean;
  onDismiss: () => void;
  children: ReactNode;
  title?: string;
  showCloseButton?: boolean;
  size?: number;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: 1,
    height: "100%",
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  actionSheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.dimensions.padding,
    height: 64,
  },
  headerTitle: {
    fontSize: theme.text.header,
  },
  buttonSlot: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 64,
  },
  content: {
    width: '100%',
    paddingHorizontal: theme.dimensions.padding,
  }
}));

export function ActionSheet({ isOpen, onDismiss, children, style, title, showCloseButton, size = 0.5 }: ActionSheetProps) {
  const styles = useStyles();
  const theme = useTheme();

  const height = size * theme.viewport.height;
  const showHeader = title || showCloseButton;

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={onDismiss}>
        <View style={styles.root}>
          <View style={StyleSheet.flatten([styles.actionSheet, { height }])}>
            {showHeader && (
              <View style={styles.header}>
                <View style={styles.buttonSlot} />
                <View>
                  <Text style={styles.headerTitle}>{title}</Text>
                </View>
                <View style={styles.buttonSlot}>
                  {showCloseButton && (
                    <IconButton name="close" onPress={onDismiss} />
                  )}
                </View>
              </View>
            
            )}
            <View style={StyleSheet.flatten([styles.content, style])}>
              {children}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}