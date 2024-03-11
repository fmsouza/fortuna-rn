import React from 'react';
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonIcon,
  IonList,
  IonProgressBar,
  IonAccordionGroup,
} from '@ionic/react';
import { addSharp, closeOutline } from 'ionicons/icons';

import { Account } from '~/accounts/types';
import { ErrorCard, FileInput } from '~/shared/components';
import { TransactionItem } from '~/transactions/components';
import { UncategorizedTransactionsModal, UpsertTransactionModal } from '~/transactions/modals';
import { Transaction } from '~/transactions/types';

import { UncategorizedTransacionsReviewCard } from '../UncategorizedTransacionsReviewCard';

import { useTransactionsModalState } from './useTransactionsModalState';

import './TransactionsModal.css';

type TransactionsModalProps = {
  account: Account;
  isOpen: boolean;
  onDismiss: () => void;
};

export const TransactionsModal: React.FC<TransactionsModalProps> = ({ account, isOpen, onDismiss }) => {
  const state = useTransactionsModalState({ account });

  return (
    <IonModal ref={state.ref} isOpen={isOpen} onDidDismiss={onDismiss} className="TransactionsModal">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton size="large" slot="icon-only" onClick={state.onCloseTransactionsModal}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Add Transactions ({state.transactions.length})</IonTitle>
          <IonButtons slot="end">
            <IonButton strong disabled={state.loading} onClick={state.onSaveTransactions}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
        {state.loading && <IonProgressBar type="indeterminate" />}
      </IonHeader>
      <IonContent>
        <IonList>
          <div className="import-button-container">
            <FileInput label="Import from CSV" onSelect={state.onImport} />
          </div>

          {state.error && (
            <ErrorCard error={state.error} />
          )}

          {state.uncategorizedTransactionGroupsCount > 0 && (
            <UncategorizedTransacionsReviewCard
              onPressReview={state.onPressReviewUncategorizedTransactions}
              uncategorizedTransactionGroupsCount={state.uncategorizedTransactionGroupsCount}
              transactionsCount={state.uncategorizedTransactionsCount}
            />
          )}

          <IonAccordionGroup expand="inset">
            {state.transactions.map((trxn, index) => (
              <TransactionItem
                key={index}
                canRemove={state.canRemoveTransactions}
                currency={account.currency}
                onEdit={() => state.onPressEditTransaction(index)}
                onRemove={() => state.onPressRemoveTransaction(index)}
                onUpdateCategory={(categoryId) => state.onUpdateTransactionCategory(index, categoryId)}
                transaction={trxn as Transaction}
              />
            ))}
          </IonAccordionGroup>
          <IonCard>
            <IonCardContent>
              <IonButton type="button" fill="clear" expand="full" onClick={state.onPressAddAnotherTransaction}>
                <IonIcon slot="start" icon={addSharp} />
                Add another transaction
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonList>
        {state.showUpsertTransactionModal && (
          <UpsertTransactionModal
            currency={account.currency}
            onDismiss={state.onDismissUpsertTransactionModal}
            transaction={state.selectedTransaction}
          />
        )}
        {state.showUncategorizedTransactionsModal && (
          <UncategorizedTransactionsModal
            onDismiss={state.onDismissReviewUncategorizedTransactions}
            transactionGroups={state.uncategorizedTransactionGroups}
          />
        )}
      </IonContent>
    </IonModal>
  );
};
