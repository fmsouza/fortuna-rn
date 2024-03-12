import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList, IonText } from "@ionic/react";
import { useMemo } from "react";

import { CURRENCY_SYMBOLS } from "~/modules/accounts/constants";
import { Account } from "~/modules/accounts/types";
import { Maybe } from "~/modules/shared/types";
import { TransactionType } from "~/modules/transactions/constants";
import { Transaction } from "~/modules/transactions/types";

type TopTransactionsViewProps = {
  account: Account;
  limit: number;
  period?: Maybe<Date>;
  transactions: Transaction[];
};

export const TopTransactionsView: React.FC<TopTransactionsViewProps> = ({ account, limit, period, transactions }) => {
  const viewMoreLink = `/accounts/${account.id}/transactions${period ? `?period=${period.toISOString()}` : ''}`;

  const mostExpensiveTransactions = useMemo(() => {
    const expenseTransactions = transactions.filter((trx) => trx.type === TransactionType.EXPENSE);
    return expenseTransactions.sort((a, b) => b.amount - a.amount);
  }, [limit, transactions]);
  
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Most expensive transactions</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {mostExpensiveTransactions.slice(0, limit).map(transaction => (
          <IonItem key={transaction.id}>
            <IonLabel>
              <h2>{transaction.title}</h2>
              <p>{transaction.details}</p>
              <IonText color="medium">
                {new Date(transaction.registeredAt).toLocaleDateString()}
              </IonText>
            </IonLabel>
            <IonText slot="end">
              {`${CURRENCY_SYMBOLS[account.currency]} ${transaction.amount}`}
            </IonText>
          </IonItem>
        ))}
      </IonCardContent>
      <IonButton fill="clear" routerLink={viewMoreLink}>View more...</IonButton>
    </IonCard>
  );
};
