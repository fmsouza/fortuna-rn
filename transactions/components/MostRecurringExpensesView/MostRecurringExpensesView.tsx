import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonNote, IonText } from "@ionic/react";
import { useMemo } from "react";
import { CURRENCY_SYMBOLS } from "accounts/constants";

import { Account } from "accounts/types";
import { Maybe } from "shared/types";
import { TransactionType } from "transactions/constants";
import { Transaction } from "transactions/types";
import { countTransactionsByTitle, sumTransactionsByTitle } from "transactions/utils";

type MostRecurringExpensesViewProps = {
  account: Account;
  limit?: number;
  period?: Maybe<Date>;
  transactions: Transaction[];
};

export const MostRecurringExpensesView: React.FC<MostRecurringExpensesViewProps> = ({ account, limit = 3, period, transactions }) => {
  const viewMoreLink = `/accounts/${account.id}/recurring-transactions${period ? `?period=${period.toISOString()}` : ''}`;

  
  const mostRecurrentTransactions: Array<{ title: string, count: number, amount: number }> = useMemo(() => {
    const expenseTransactions = transactions.filter((trx) => trx.type === TransactionType.EXPENSE);
    const groups = countTransactionsByTitle(expenseTransactions);
    const sumByTitle = sumTransactionsByTitle(expenseTransactions);
    return Object.entries(groups).sort((a, b) => b[1] - a[1]).map(([title, count]) => ({
      title,
      count,
      amount: sumByTitle[title],
    }));
  }, [transactions]);
  
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Most recurring expenses</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {mostRecurrentTransactions.slice(0, limit).map(({title, count, amount}) => (
          <IonItem key={title}>
            <IonLabel>
              <h2>{title}</h2>
              <IonNote>Total: {`${CURRENCY_SYMBOLS[account.currency]} ${amount.toFixed(2)}`}</IonNote>
            </IonLabel>
            <IonNote slot="end">
              Registered {count} times
            </IonNote>
          </IonItem>
        ))}
      </IonCardContent>
      <IonButton fill="clear" routerLink={viewMoreLink}>View more...</IonButton>
    </IonCard>
  );
};
