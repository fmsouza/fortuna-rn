import dayjs from "dayjs";
import { FlatList, View } from "react-native";
import {
  Button,
  Modal,
  ProgressBar,
  Snackbar,
  Surface,
} from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { Container, HeaderButton } from "~/modules/shared/components";
import { useHeaderOptions } from "~/modules/shared/navigation";

import { useAccountDetailsScreenState } from "./useAccountDetailsScreenState";
import { Overview } from "./Overview";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    flex: 1,
  },
  modalContainer: {
    paddingHorizontal: theme.dimensions.spacing(4),
    maxHeight: "75%",
  },
  surface: {
    borderRadius: theme.dimensions.radius(2),
  },
  modalScrollContainer: {
    padding: theme.dimensions.spacing(),
  },
  modalItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.dimensions.spacing(2),
  },
}));

export function AccountDetailsScreen() {
  const styles = useStyles();
  const state = useAccountDetailsScreenState();
  const t = useText();

  useHeaderOptions({
    title: state.account?.title ?? "",
    headerRight: () => (
      <HeaderButton
        title={t("common.actions.add")}
        icon="plus"
        link={`/import-transactions/${state.account?.id}`}
      />
    ),
  });

  const isDateSelected = (date: Maybe<Date>) => {
    if (!date && !state.currentPeriod) return true;
    if (!date && state.currentPeriod) return false;
    return dayjs(date).isSame(state.currentPeriod);
  };

  return (
    <Container style={styles.container}>
      {state.loading && <ProgressBar indeterminate />}
      <Snackbar visible={state.error !== null} onDismiss={() => {}}>
        {state.error?.message}
      </Snackbar>
      {state.account && (
        <Overview
          account={state.account!}
          canGoToNextMonth={state.canGoToNextMonth}
          canGoToPreviousMonth={state.canGoToPreviousMonth}
          period={state.currentPeriod}
          periods={state.periods}
          onChangePeriod={state.handleChangePeriod}
          onPressAddTransactions={state.handlePressAddTransactions}
          onPressChangePeriod={state.handlePressChangePeriod}
        />
      )}
      {state.showChangePeriodModal && (
        <Modal
          visible
          contentContainerStyle={styles.modalContainer}
          onDismiss={state.dismissChangePeriodModal}
        >
          <Surface style={styles.surface}>
            <FlatList
              contentContainerStyle={styles.modalScrollContainer}
              data={state.periods}
              numColumns={3}
              keyExtractor={(item) => item?.toISOString() ?? "all-time"}
              renderItem={({ item }) => (
                <View style={styles.modalItem}>
                  <Button
                    mode={
                      isDateSelected(item) ? "contained" : "contained-tonal"
                    }
                    compact
                    onPress={() =>
                      state.handleChangePeriod({ newPeriod: item })
                    }
                  >
                    {item
                      ? dayjs(item).format("MMM YYYY")
                      : t("screens.accountDetails.allTime")}
                  </Button>
                </View>
              )}
            />
          </Surface>
        </Modal>
      )}
    </Container>
  );
}
