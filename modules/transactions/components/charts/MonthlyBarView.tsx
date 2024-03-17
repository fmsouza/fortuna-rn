import React, { useMemo } from "react";
import { useTheme } from "react-native-paper";
import { CartesianChart, Bar } from "victory-native";
import { useFont } from "@shopify/react-native-skia";

import { Theme } from "~/theme";
import { Account } from "~/modules/accounts/types";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByMonth } from "~/modules/transactions/utils";

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

type MonthlyBarViewProps = {
  account: Account;
  transactions: Transaction[];
};
export function MonthlyBarView({ account, transactions }: MonthlyBarViewProps) {
  const theme = useTheme() as Theme;
  const font = useFont(require("./roboto-regular.ttf"));
  const aggregatedTransactionValues = useMemo(() => aggregateByMonth(transactions), [transactions]);
  const records = useMemo(() => MONTHS.map((month, index) => ({
    month,
    amount: aggregatedTransactionValues[index],
  })), [aggregatedTransactionValues]);

  return (
    <CartesianChart 
      data={records}
      xKey="month"
      yKeys={["amount"]}
      padding={{ top: 0, right: 0, bottom: 10, left: 0 }}
      axisOptions={{
        font,
        tickCount: { x: 6, y: 0 },
        formatXLabel: (value) => {
          const date = new Date();
          date.setMonth(value - 1);
          return date.toLocaleString("default", { month: "short" });
        },
      }}
    >
      {({ points, chartBounds }) => (
        <>
          <Bar
            antiAlias
            points={points.amount}
            chartBounds={chartBounds}
            color={theme.colors.primary}
            roundedCorners={{ topLeft: 50, topRight: 50 }}
          />
        </>
      )}
    </CartesianChart>
  );
};
