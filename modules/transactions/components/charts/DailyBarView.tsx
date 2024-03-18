import React, { useMemo } from "react";
import { useTheme } from "react-native-paper";
import { CartesianChart, Bar } from "victory-native";
import { useFont } from "@shopify/react-native-skia";

import { Theme } from "~/theme";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByDayOfMonth, listDaysInMonth } from "~/modules/transactions/utils";

type DailyBarViewBarViewProps = {
  transactions: Transaction[];
};
export function DailyBarViewBarView({ transactions }: DailyBarViewBarViewProps) {
  const theme = useTheme() as Theme;
  const font = useFont(require("./roboto-regular.ttf"));
  const labels = useMemo(() => listDaysInMonth(transactions[0].registeredAt), [transactions]);
  const aggregatedTransactionValues = useMemo(() => aggregateByDayOfMonth(transactions), [transactions]);
  const records = useMemo(() => labels.map((dayOfMonth) => ({
    dayOfMonth,
    amount: aggregatedTransactionValues[dayOfMonth],
  })), [aggregatedTransactionValues, labels]);

  return (
    <CartesianChart 
      data={records}
      xKey="dayOfMonth"
      yKeys={["amount"]}
      padding={{ top: 0, right: 0, bottom: 10, left: 0 }}
      axisOptions={{
        font,
        tickCount: { x: 15, y: 0 },
        formatXLabel: (value) => {
          const date = new Date();
          date.setDate(value + 1);
          return date.toLocaleString("default", { day: "numeric" });
        },
      }}
    >
      {({ points, chartBounds }) => (
        <Bar
          antiAlias
          points={points.amount}
          chartBounds={chartBounds}
          color={theme.colors.primary}
          roundedCorners={{ topLeft: 50, topRight: 50 }}
        />
      )}
    </CartesianChart>
  );
};
