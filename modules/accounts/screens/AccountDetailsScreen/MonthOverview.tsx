import { Account } from '~/modules/accounts/types';
import { BalanceView, DailyBarViewBarView, MostRecurringExpensesView } from '~/modules/transactions/components';
import { Transaction } from '~/modules/transactions/types';

type MonthOverviewProps = {
  account: Account;
  currentPeriod: Date;
  transactions: Transaction[];
};

export function MonthOverview({account, currentPeriod, transactions}: MonthOverviewProps) {
  return (
    <>
      <DailyBarViewBarView transactions={transactions} />
      <BalanceView account={account} transactions={transactions} />
      {/*
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