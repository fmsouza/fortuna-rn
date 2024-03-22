import { Link } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { IconButton, ProgressBar, Snackbar } from "react-native-paper";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import {
  Container,
  Dialog,
  HeaderButton,
  NoItems,
} from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";

import { AccountItem } from "./AccountItem";
import { useAccountsScreen } from "./useAccountsScreen";

const useStyles = makeStyles((theme) => ({
  listContainer: {
    padding: theme.dimensions.spacing(),
  },
  row: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    marginVertical: theme.dimensions.spacing(),
  },
  swipeDeleteActionView: {
    width: 64,
    backgroundColor: "red",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  swipeEditActionView: {
    width: 64,
    backgroundColor: theme.colors.surface,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export function AccountsScreen() {
  const styles = useStyles();
  const t = useText();
  const state = useAccountsScreen();

  useHeaderOptions({
    title: t("screens.accounts.title"),
    headerLeft: () => (
      <HeaderButton
        title={t("screens.accounts.actions.settings")}
        icon="cog"
        link="/settings"
      />
    ),
    headerRight: () => (
      <HeaderButton
        title={t("common.actions.new")}
        icon="plus"
        link="/new-account"
      />
    ),
  });

  return (
    <Container>
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>
        {state.error?.message}
      </Snackbar>
      {state.loading ? (
        <ProgressBar indeterminate />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={state.accounts}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <NoItems message={t("screens.accounts.noAccounts")} />
          }
          renderItem={({ item }) => (
            <Swipeable
              containerStyle={styles.row}
              renderLeftActions={() => (
                <View style={styles.swipeEditActionView}>
                  <IconButton
                    icon="pencil"
                    size={32}
                    onPress={() => state.handleEditPress(item)}
                  />
                </View>
              )}
              renderRightActions={() => (
                <View style={styles.swipeDeleteActionView}>
                  <IconButton
                    icon="delete"
                    size={32}
                    iconColor="white"
                    onPress={() => state.handleDeletePress(item)}
                  />
                </View>
              )}
            >
              <Link href={`/account/${item.id}`} asChild>
                <Pressable>
                  <AccountItem account={item} />
                </Pressable>
              </Link>
            </Swipeable>
          )}
        />
      )}
      {state.showDeleteConfirmation && (
        <Dialog
          visible
          title={t("screens.accounts.deleteAccountDialog.title")}
          description={t("screens.accounts.deleteAccountDialog.content")}
          onConfirm={state.handleConfirmDelete}
          onDismiss={state.handleDismissDeleteConfirmation}
        />
      )}
    </Container>
  );
}
