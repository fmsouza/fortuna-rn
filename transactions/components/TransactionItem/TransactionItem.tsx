import { IonAccordion, IonButton, IonIcon, IonItem, IonLabel, IonNote } from "@ionic/react";
import { trendingDown, trendingUp } from "ionicons/icons";

import { CURRENCY_SYMBOLS, Currency } from "accounts/constants";
import { CategorySelectInput } from "~/shared/components";
import { Transaction } from "transactions/types";

import './TransactionItem.css';

type TransactionItemProps = {
  canRemove?: boolean;
  currency: Currency;
  onEdit: () => void;
  onRemove: () => void;
  onUpdateCategory: (categoryId: string) => void;
  transaction: Transaction;
};

export const TransactionItem: React.FC<TransactionItemProps> = ({ canRemove, currency, onEdit, onRemove, onUpdateCategory, transaction }) => {
  return (
    <IonAccordion className="TransactionItem">
      <IonItem slot="header">
        <IonLabel className="header">
          <div className="wrapper icon">
            <IonIcon
              icon={transaction.type === 'income' ? trendingUp : trendingDown}
              color={transaction.type === 'income' ? 'success' : 'danger'}
            />
          </div>
          <div className="wrapper title">
            {transaction.title}
            <br/>
            <IonNote>{CURRENCY_SYMBOLS[currency]} {transaction.amount}</IonNote>
          </div>
        </IonLabel>
        <div className="wrapper category">
          <CategorySelectInput
            value={transaction.categoryId}
            onChange={onUpdateCategory}
          />
        </div>
      </IonItem>
      <div className="ion-padding" slot="content">
        <IonLabel>
          Registered at: <IonNote>{new Date(transaction.registeredAt).toLocaleDateString()}</IonNote>
          <br/>
          {transaction.origin && (
            <>
              Origin: <IonNote>{transaction.origin}</IonNote>
            </>
          )}
          <br/>
          {transaction.details && (
            <>
              Extra details: <IonNote>{transaction.details}</IonNote>
              <br/>
            </>
          )}
          External ID: <IonNote>{transaction.externalId}</IonNote>
        </IonLabel>
        <br/>
        <IonButton type="button" fill="clear" onClick={onEdit}>Edit</IonButton>
        {canRemove && <IonButton type="button" fill="clear" onClick={onRemove}>Remove</IonButton>}
      </div>
    </IonAccordion>
  );
};
