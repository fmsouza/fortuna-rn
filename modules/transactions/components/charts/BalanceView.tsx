import { Card, Icon } from "react-native-paper";

import { useText } from "~/intl";
import { Account } from "~/modules/accounts/types";
import { CURRENCY_SYMBOLS } from "~/modules/accounts/constants";
import { Transaction } from "~/modules/transactions/types";
import { aggregateByType } from "~/modules/transactions/utils";

type BalanceViewProps = {
  account: Account;
  transactions: Transaction[];
};

export const BalanceView: React.FC<BalanceViewProps> = ({
  account,
  transactions,
}) => {
  const t = useText();
  const { income: incomeAmount, expense: expenseAmount } =
    aggregateByType(transactions);

  const balance = incomeAmount - expenseAmount;
  const color = balance > 0 ? "green" : "red";

  return (
    <Card>
      <Card.Content>
        <Card.Content>
          <Card.Title
            title={t("screens.accountDetails.balance")}
            titleVariant="titleLarge"
          />
          <Card.Title
            titleVariant="titleMedium"
            titleStyle={{ color }}
            title={`${CURRENCY_SYMBOLS[account.currency]} ${balance.toFixed(
              2
            )}`}
            right={({ size }) => (
              <Icon
                size={size}
                color={color}
                source={balance > 0 ? "trending-up" : "trending-down"}
              />
            )}
          />
        </Card.Content>
      </Card.Content>
    </Card>
  );
};
