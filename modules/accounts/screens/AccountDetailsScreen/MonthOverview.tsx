import { Account } from '~/modules/accounts/types';
import { BalanceView, MostRecurringExpensesView } from '~/modules/transactions/components';
import { Transaction } from '~/modules/transactions/types';

type MonthOverviewProps = {
  account: Account;
  currentPeriod: Date;
  transactions: Transaction[];
};

export function MonthOverview({account, currentPeriod, transactions}: MonthOverviewProps) {
  return (
    <>
      <BalanceView account={account} transactions={transactions} />
      {/*
      <DailyBarViewBarView transactions={transactions} />
      <IncomeExpenseBarView transactions={transactions} />
      <CategoryPieView account={account} transactions={transactions} />
      <TransactionsListView account={account} transactions={transactions} period={currentPeriod} />
      */}
      {transactions.length > 3 && (
        <>
          {/* <TopTransactionsView account={account} limit={3} transactions={transactions} /> */}
          <MostRecurringExpensesView account={account} transactions={transactions} />
        </>
      )}
    </>
  );
};