import { Account } from '~/modules/accounts/types';
import { CategoryPieView, MonthlyBarView, MostRecurringExpensesView, TopCategoryExpensesView } from '~/modules/transactions/components';
import { Transaction } from '~/modules/transactions/types';

type AllTimeInsightsProps = {
  account: Account;
  transactions: Transaction[];
};

export function AllTimeInsights({account, transactions}: AllTimeInsightsProps) {
  return (
    <>
      <MonthlyBarView account={account} transactions={transactions} />
      <CategoryPieView transactions={transactions} />
      <TopCategoryExpensesView transactions={transactions} />
      <MostRecurringExpensesView account={account} transactions={transactions} />
    </>
  );
};