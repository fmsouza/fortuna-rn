import { Banner, Icon } from "react-native-paper";

type ReviewUncategorizedTransactionsProps = {
  onPressReview: () => void;
  transactionsCount: number;
  uncategorizedTransactionGroupsCount: number;
};

export function ReviewUncategorizedTransactions({ onPressReview, transactionsCount, uncategorizedTransactionGroupsCount }: ReviewUncategorizedTransactionsProps) {
  return (
    <Banner
      visible
      actions={[
        {
          label: 'Rewview',
          onPress: onPressReview,
        },
      ]}
      icon={({size}) => (
        <Icon source="alert-circle-outline" size={size} />
      )}>
      We've identified {transactionsCount} transactions in {uncategorizedTransactionGroupsCount} different groups which still doesn't have a category.
    </Banner>
  );
}