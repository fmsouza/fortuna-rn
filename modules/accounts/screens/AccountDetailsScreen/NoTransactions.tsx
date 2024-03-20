import { Banner, Icon } from "react-native-paper";

import { useText } from "~/intl";

type NoTransactionsProps = {
  onPressAddTransactions: () => void;
};

export function NoTransactions({
  onPressAddTransactions,
}: NoTransactionsProps) {
  const t = useText();
  return (
    <Banner
      visible
      actions={[
        {
          label: t("screens.transactions.actions.addTransactions"),
          onPress: onPressAddTransactions,
        },
      ]}
      icon={({ size }) => <Icon source="alert-circle-outline" size={size} />}
    >
      {t("screens.transactions.noTransactions")}
    </Banner>
  );
}
