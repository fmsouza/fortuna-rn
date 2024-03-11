import { IonAccordionGroup, IonAlert, IonBackButton, IonBadge, IonButtons, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/react';
import { alertCircleOutline } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import { Virtuoso } from 'react-virtuoso';

import { TransactionItem } from 'transactions/components';
import { UncategorizedTransactionsModal, UpsertTransactionModal } from 'transactions/modals';

import { useTransactionsPageState } from './useTransactionsPageState';

import './TransactionsPage.css';

type TransactionsPageProps = RouteComponentProps<{
  accountId: string;
}>;

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ match }) => {
  const params = new URLSearchParams(location.search);
  const state = useTransactionsPageState({
    accountId: match.params.accountId,
    period: params.get('period') ? new Date(params.get('period')!) : null,
  });

  return (
    <IonPage className="TransactionsPage">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Transactions</IonTitle>
        </IonToolbar>
        {state.loading && <IonProgressBar type="indeterminate" />}
      </IonHeader>

      <IonContent fullscreen>
        {!state.loading && !state.error && (
          <>
            <IonAccordionGroup expand="inset" style={{ height: '100%' }}>
              {state.uncategorizedTransactionsCount > 0 && (
                <div className="uncategorized-button-container">
                    <IonChip color="warning" onClick={state.onPressUncategorizedTransactions}>
                      <IonIcon icon={alertCircleOutline} />
                      <IonLabel>Review Uncategorized</IonLabel>
                      &nbsp;&nbsp;
                      <IonBadge color="warning">{state.uncategorizedTransactionsCount}</IonBadge>
                    </IonChip>
                </div>
              )}
              <Virtuoso
                style={{ height: '100%' }}
                totalCount={state.transactions.length}
                itemContent={(index) => {
                  const trxn = state.transactions[index];
                  return (
                    <TransactionItem
                      key={trxn.id}
                      canRemove
                      currency={state.account!.currency}
                      onEdit={() => state.onPressEditTransaction(trxn)}
                      onRemove={() => state.onPressRemoveTransaction(trxn)}
                      onUpdateCategory={(categoryId) => state.onChangeTransactionCategory(trxn, categoryId)}
                      transaction={trxn}
                    />
                  );
                }}
              />
            </IonAccordionGroup>
          </>
        )}
        {state.showRemoveAlert && (
          <IonAlert
            isOpen
            header="Delete transaction"
            subHeader="Are you sure you want to remove this transaction?"
            message="This operation cannot be undone."
            onDidDismiss={state.handleDismissRemoveAlert}
            buttons={[
              { text: 'Cancel', role: 'cancel' },
              {
                text: 'OK',
                role: 'confirm',
                handler: () => state.handleRemoveSelectedTransaction(),
              },
            ]}
          />
        )}
        {state.showEditTransactionModal && (
          <UpsertTransactionModal
            currency={state.account!.currency}
            transaction={state.selectedTransaction}
            onDismiss={state.handleDismissEditTransactionModal}
          />
        )}
        {state.showUncategorizedTransactionsModal && (
          <UncategorizedTransactionsModal
            transactionGroups={state.uncategorizedTransactionGroups}
            onDismiss={state.handleDismissUncategorizedTransactionsModal}
          />
        )}
      </IonContent>
    </IonPage>
  );
};
