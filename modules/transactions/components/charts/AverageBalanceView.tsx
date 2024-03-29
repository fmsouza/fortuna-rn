import dayjs from "dayjs";
import { useMemo } from "react";
import { Card, useTheme } from "react-native-paper";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory-native";

import { useText } from "~/intl";
import { Theme } from "~/theme";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByMonth } from "~/modules/transactions/utils";

const NUMBER_OF_MONTHS = 3;

const THIS_MONTH = dayjs().startOf("month");

const N_MONTHS_AGO = dayjs()
  .subtract(NUMBER_OF_MONTHS, "month")
  .startOf("month");

const LAST_N_MONTHS = Array.from({ length: NUMBER_OF_MONTHS }, (_, i) =>
  THIS_MONTH.subtract(i, "month")
);

type AverageBalanceViewProps = {
  transactions: Transaction[];
};

export function AverageBalanceView({ transactions }: AverageBalanceViewProps) {
  const t = useText();
  const theme = useTheme() as Theme;

  const filteredTransactions = useMemo(
    () =>
      transactions
        .filter((trx) => dayjs(trx.registeredAt).isAfter(N_MONTHS_AGO))
        .sort((a, b) => dayjs(a.registeredAt).diff(dayjs(b.registeredAt))),
    [transactions]
  );

  const totalBalance = useMemo(
    () => filteredTransactions.reduce((acc, trx) => acc + trx.amount, 0),
    [transactions]
  );

  const aggregatedTransactionValues = useMemo(
    () => aggregateByMonth(filteredTransactions),
    [transactions]
  );

  const recordsByMonth = useMemo(() => {
    const records = LAST_N_MONTHS.map((month) => ({
      month: month.toDate().toLocaleString("default", { month: "short" }),
      amount: 0,
    }));

    Object.entries(aggregatedTransactionValues).forEach(([month, amount]) => {
      const index = LAST_N_MONTHS.findIndex((m) =>
        m.isSame(dayjs(month), "month")
      );
      if (index !== -1) {
        records[index].amount = amount;
      }
    });

    return records;
  }, [aggregatedTransactionValues]);

  let lineColor: string;
  switch (true) {
    case totalBalance > 0: {
      lineColor = "green";
      break;
    }
    case totalBalance < 0: {
      lineColor = "red";
      break;
    }
    default: {
      lineColor = "gray";
    }
  }

  return (
    <Card>
      <Card.Content>
        <Card.Content>
          <Card.Title
            title={t("screens.accountDetails.averageBalance", {
              months: String(NUMBER_OF_MONTHS),
            })}
            titleVariant="titleLarge"
          />
          <VictoryChart
            theme={VictoryTheme.material}
            width={theme.viewport.width - theme.dimensions.spacing(9)}
            height={theme.viewport.height / 7}
            padding={{ left: 10, right: 10, bottom: 24 }}
          >
            <VictoryLine
              style={{
                data: { stroke: lineColor },
                parent: { border: "1px solid #ccc" },
                labels: {
                  fontSize: 15,
                },
              }}
              data={recordsByMonth}
              labels={({ datum }) => datum.amount.toFixed(2)}
              x="month"
              y="amount"
            />
            <VictoryAxis
              style={{
                ticks: { display: "none" },
                grid: { stroke: theme.colors.primary, strokeOpacity: 0.4 },
              }}
              minDomain={{ y: -10 }}
            />
          </VictoryChart>
        </Card.Content>
      </Card.Content>
    </Card>
  );
}
