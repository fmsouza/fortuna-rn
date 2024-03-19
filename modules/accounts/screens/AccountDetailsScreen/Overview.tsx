import dayjs from "dayjs";
import { IconButton, Surface, Text } from "react-native-paper";
import { ScrollView, View } from "react-native";

import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { Account } from "~/modules/accounts/types";

import { MonthOverview } from "./MonthOverview";
import { AllTimeInsights } from "./AllTimeInsights";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  headerButton: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: theme.dimensions.spacing(),
  }
}));

type OverviewProps = {
  account: Account;
  canGoToPreviousMonth: boolean;
  canGoToNextMonth: boolean;
  onChangePeriod: (direction: 'back' | 'next') => void;
  period: Maybe<Date>;
};

export function Overview({account, canGoToPreviousMonth, canGoToNextMonth, onChangePeriod, period}: OverviewProps) {
  const styles = useStyles();

  const handleChangePeriod = (direction: 'back' | 'next') => {
    return onChangePeriod(direction);
  };

  const BodyComponent = period ? MonthOverview : AllTimeInsights;

  return (
    <View style={styles.container}>
      <Surface mode="flat" elevation={4} style={styles.header}>
        <View style={styles.headerButton}>
          {canGoToNextMonth && (
            <IconButton
              icon="chevron-left"
              onPress={() => handleChangePeriod('next')}
            />
          )}
        </View>
        <View>
          <Text variant="titleMedium">{!period ? 'All' : dayjs(period).format('MMM YYYY')}</Text>
        </View>
        <View style={styles.headerButton}>
          {canGoToPreviousMonth && (
            <IconButton
              icon="chevron-right"
              onPress={() => handleChangePeriod('back')}
            />
          )}
        </View>
      </Surface>
      <ScrollView style={styles.content}>
        <BodyComponent account={account} currentPeriod={period!} />
      </ScrollView>
    </View>
  );
}