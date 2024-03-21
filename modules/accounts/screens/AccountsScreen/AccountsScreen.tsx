import { Link } from "expo-router";
import { FlatList, Pressable } from "react-native";
import { ProgressBar, Snackbar } from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { Container, HeaderButton, NoItems } from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";
import { useAccounts } from "~/modules/accounts/hooks";

import { AccountItem } from "./AccountItem";

const useStyles = makeStyles((theme) => ({
  listContainer: {
    paddingHorizontal: theme.dimensions.spacing(),
  },
  row: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: theme.dimensions.spacing(2),
  },
}));

export function AccountsScreen() {
  const styles = useStyles();
  const t = useText();
  const { accounts, loading, error } = useAccounts();

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
      <Snackbar visible={error !== null} onDismiss={() => {}}>
        {error?.message}
      </Snackbar>
      {loading ? (
        <ProgressBar indeterminate />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={accounts}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <NoItems message={t("screens.accounts.noAccounts")} />
          }
          renderItem={({ item }) => (
            <Link href={`/account/${item.id}`} asChild>
              <Pressable style={styles.row}>
                <AccountItem account={item} />
              </Pressable>
            </Link>
          )}
        />
      )}
    </Container>
  );
}
