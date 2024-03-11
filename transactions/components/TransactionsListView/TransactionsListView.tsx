import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList, IonNote, IonText } from "@ionic/react";

import { CURRENCY_SYMBOLS } from "accounts/constants";
import { Account } from "accounts/types";
import { Maybe } from "shared/types";
import { Transaction } from "transactions/types";

type TransactionsListViewProps = {
  account: Account;
  transactions: Transaction[];
  period?: Maybe<Date>;
};

const TRANSACTIONS_LIST_SIZE = 2;

export const TransactionsListView: React.FC<TransactionsListViewProps> = ({ account, transactions, period }) => {
  const viewMoreLink = `/accounts/${account.id}/transactions${period ? `?period=${period.toISOString()}` : ''}`;
  
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          Transactions <IonNote>({transactions.length})</IonNote>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {transactions.slice(0, TRANSACTIONS_LIST_SIZE).map((transaction) => (
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