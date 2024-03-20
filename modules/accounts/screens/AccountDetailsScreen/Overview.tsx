import dayjs from "dayjs";
import { ScrollView, View } from "react-native";
import { Button, IconButton, Surface } from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { Account } from "~/modules/accounts/types";

import { MonthOverview } from "./MonthOverview";
import { AllTimeInsights } from "./AllTimeInsights";
import { NoTransactions } from "./NoTransactions";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
  },
  headerButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 48,
  },
  dateSelectDropdown: {
    height: 40,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    padding: theme.dimensions.spacing(),
  },
}));

type OverviewProps = {
  account: Account;
  periods: Array<Maybe<Date>>;
  canGoToPreviousMonth: boolean;
  canGoToNextMonth: boolean;
  onChangePeriod: (input: {
    direction?: "back" | "next";
    newPeriod?: Maybe<Date>;
  }) => void;
  onPressAddTransactions: () => void;
  onPressChangePeriod: () => void;
  period: Maybe<Date>;
};

export function Overview({
  account,
  canGoToPreviousMonth,
  canGoToNextMonth,
  onChangePeriod,
  onPressAddTransactions,
  onPressChangePeriod,
  period,
  periods,
}: OverviewProps) {
  const styles = useStyles();
  const t = useText();

  const handleChangePeriod = (direction: "back" | "next") => {
    return onChangePeriod({ direction });
  };

  const BodyComponent = period ? MonthOverview : AllTimeInsights;

  return (
    <View style={styles.container}>
      {periods.length === 0 ? (
        <NoTransactions onPressAddTransactions={onPressAddTransactions} />
      ) : (
        <>
          <Surface mode="flat" elevation={4} style={styles.header}>
            <View style={styles.headerButton}>
              {canGoToNextMonth && (
                <IconButton
                  icon="chevron-left"
                  onPress={() => handleChangePeriod("next")}
                />
              )}
            </View>
            <View>
              <Button
                contentStyle={{ flexDirection: "row-reverse" }}
                icon="menu-down"
                mode="text"
                compact
                onPress={onPressChangePeriod}
              >
                {period
                  ? dayjs(period).format("MMM YYYY")
                  : t("screens.accountDetails.allTime")}
              </Button>
            </View>
            <View style={styles.headerButton}>
              {canGoToPreviousMonth && (
                <IconButton
                  icon="chevron-right"
                  onPress={() => handleChangePeriod("back")}
                />
              )}
            </View>
          </Surface>
          <ScrollView style={styles.content}>
            <BodyComponent
              account={account}
              currentPeriod={period!}
              onPressAddTransactions={onPressAddTransactions}
            />
          </ScrollView>
        </>
      )}
    </View>
  );
}
