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
    flex: 1
  }
}));

type OverviewProps = {
  account: Account;
  canMovePeriodBack: boolean;
  canMovePeriodForward: boolean;
  onChangePeriod: (newPeriod: Date) => void;
  period: Maybe<Date>;
};

export function Overview({account, canMovePeriodBack, canMovePeriodForward, onChangePeriod, period}: OverviewProps) {
  const styles = useStyles();

  const handleChangePeriod = (direction: 'next' | 'back') => {
    const newPeriod = direction === 'next' ? dayjs(period ?? undefined).subtract(1, 'month').toDate() : dayjs(period).subtract(1, 'month').toDate();
    console.log('newPeriod', newPeriod);
    onChangePeriod(newPeriod);
  };

  const BodyComponent = period ? MonthOverview : AllTimeInsights;

  return (
    <View style={styles.container}>
      <Surface mode="flat" style={styles.header}>
        <View style={styles.headerButton}>
          {canMovePeriodBack && (
            <IconButton
              icon="chevron-left"
              onPress={() => handleChangePeriod('back')}
            />
          )}
        </View>
        <View>
          <Text variant="titleMedium">{!period ? 'All' : dayjs(period).format('MMM YYYY')}</Text>
        </View>
        <View style={styles.headerButton}>
          {canMovePeriodForward && (
            <IconButton
              icon="chevron-right"
              onPress={() => handleChangePeriod('next')}
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