import dayjs from "dayjs";
import { IconButton, Surface, Text } from "react-native-paper";
import { ScrollView, View } from "react-native";

import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { Account } from "~/modules/accounts/types";

import { MonthOverview } from "./MonthOverview";
import { AllTimeInsights } from "./AllTimeInsights";
import { Dropdown } from "~/modules/shared/components";

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
  dateSelectDropdown: {
    height: 40,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: theme.dimensions.spacing(),
  }
}));

type PeriodOption = {
  label: string;
  value: string;
};

type OverviewProps = {
  account: Account;
  periods: PeriodOption[];
  canGoToPreviousMonth: boolean;
  canGoToNextMonth: boolean;
  onChangePeriod: (input: { direction?: "back" | "next", newPeriod?: Date | "all" }) => void;
  period: Maybe<Date>;
};

export function Overview({account, canGoToPreviousMonth, canGoToNextMonth, onChangePeriod, period, periods}: OverviewProps) {
  const styles = useStyles();

  const handleChangePeriod = (direction: 'back' | 'next') => {
    return onChangePeriod({ direction });
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
          <Dropdown
            style={styles.dateSelectDropdown}
            mode="flat"
            underlineColor="transparent"
            options={periods}
            value={period?.toISOString() ?? 'all'}
            onChange={(value) => onChangePeriod({ newPeriod: value === 'all' ? 'all' : new Date(value as string) })}
          />
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