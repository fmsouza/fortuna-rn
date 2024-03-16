import { Banner, Icon } from "react-native-paper";

type NoTransactionsProps = {
  onPressAddTransactions: () => void;
};

export function NoTransactions({ onPressAddTransactions }: NoTransactionsProps) {
  return (
    <Banner
      visible
      actions={[
        {
          label: 'Add transactions',
          onPress: onPressAddTransactions,
        },
      ]}
      icon={({size}) => (
        <Icon source="alert-circle-outline" size={size} />
      )}>
      No transactions here yet. Start adding new transactions to make this page more interesting!
    </Banner>
  );
}