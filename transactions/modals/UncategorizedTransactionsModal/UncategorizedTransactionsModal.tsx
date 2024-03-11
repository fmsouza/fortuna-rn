import React, { useRef } from 'react';
import {
  IonModal,
  IonContent,
  IonList,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

import { Maybe } from 'shared/types';
import { CategorySelectInput } from '~/shared/components';

type UncategorizedTransactionsModalProps = {
  onDismiss: (updates?: Maybe<Record<string, string>>) => void;
  transactionGroups: Record<string, number>;
};

export const UncategorizedTransactionsModal: React.FC<UncategorizedTransactionsModalProps> = ({ onDismiss, transactionGroups }) => {
  const modal = useRef<HTMLIonModalElement>(null);
  const values = useRef<Record<string, string>>({});

  const onClose = () => {
    modal.current?.dismiss();
  };

  const onUpdate = async () => {
    if (Object.keys(values.current).length > 0) {
      modal.current?.dismiss(values.current);
    } else {
      modal.current?.dismiss();
    }
  };

  const groups = Object.keys(transactionGroups).sort((a, b) => transactionGroups[b] - transactionGroups[a]);

  return (
    <IonModal ref={modal} isOpen onDidDismiss={(e) => onDismiss(e.detail.data)}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton size="large" slot="icon-only" onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Review Categories</IonTitle>
          <IonButtons slot="end">
            <IonButton strong onClick={onUpdate}>
              Update
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {groups.map((group, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle>{group}</IonCardTitle>
                <IonCardSubtitle>{transactionGroups[group]} {pluralize(transactionGroups[group], 'transaction', 'transactions')} with this title</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <CategorySelectInput
                  labelPlacement="fixed"
                  label="Category"
                  placeholder="Category"
                  value={values.current[group] ?? 'other'}
                  onChange={(id) => {
                    values.current[group] = id;
                  }}
                />
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

const pluralize = (count: number, singular: string, plural: string) => {
  return count === 1 ? singular : plural;
}