import { Banner, Icon } from "react-native-paper";

import { useText } from "~/intl";

type ReviewUncategorizedTransactionsProps = {
  onPressReview: () => void;
  transactionsCount: number;
  uncategorizedTransactionGroupsCount: number;
};

export function ReviewUncategorizedTransactions({
  onPressReview,
  transactionsCount,
  uncategorizedTransactionGroupsCount,
}: ReviewUncategorizedTransactionsProps) {
  const t = useText();
  return (
    <Banner
      visible
      actions={[
        {
          label: t("common.actions.review"),
          onPress: onPressReview,
        },
      ]}
      icon={({ size }) => <Icon source="alert-circle-outline" size={size} />}
    >
      {t("screens.transactions.hasUncategorizedTransactions", {
        transactionsCount: String(transactionsCount),
        uncategorizedTransactionGroupsCount: String(
          uncategorizedTransactionGroupsCount
        ),
      })}
    </Banner>
  );
}
