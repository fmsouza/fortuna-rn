import React, { useEffect, useRef } from 'react';
import {
  IonButton,
  IonModal,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonNote,
  IonDatetimeButton,
  IonDatetime,
  IonList,
} from '@ionic/react';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import { CURRENCY_SYMBOLS, Currency } from 'accounts/constants';
import { Maybe } from 'shared/types';
import { TransactionType } from 'transactions/constants';
import { Transaction } from 'transactions/types';
import { CategorySelectInput } from '~/shared/components';

type UpsertTransactionModalProps = {
  currency: Currency;
  onDismiss: (trx?: Maybe<Partial<Transaction>>) => void;
  transaction?: Maybe<Partial<Transaction>>;
};

export const UpsertTransactionModal: React.FC<UpsertTransactionModalProps> = ({ currency, onDismiss, transaction }) => {
  const modal = useRef<HTMLIonModalElement>(null);

  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
    reset,
  } = useForm<Partial<Transaction>>({
    defaultValues: {
      externalId: undefined,
      type: undefined,
      title: undefined,
      amount: undefined,
      origin: undefined,
      details: undefined,
      categoryId: undefined,
      registeredAt: new Date(),
    }
  });

  useEffect(() => {
    if (transaction) {
      reset(transaction);
    }
  }, [transaction]);

  const onSubmit = async (values: Partial<Transaction>) => {
    modal.current?.dismiss(values);
  };

  return (
    <IonModal ref={modal} isOpen onDidDismiss={(e) => onDismiss(e.detail.data)} initialBreakpoint={0.9} breakpoints={[0, 0.9]}>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Title</IonLabel>
              <IonInput
                {...register("title", { required: 'A title is required' })}
                placeholder="Energy bill, groceries, etc."
                type="text"
                aria-label="Transaction title"
              />
            </IonItem>
            <ErrorMessage
              errors={errors}
              name="title"
              as={<IonNote className="error" />}
            />
            
            <IonItem>
              <Controller
                control={control}
                name="type"
                rules={{ required: 'A type is required' }}
                render={({ field }) => (
                  <IonSelect
                    labelPlacement="fixed"
                    label="Type"
                    placeholder="Income or Expense"
                    value={field.value}
                    onIonChange={e => setValue("type", e.detail.value)}
                  >
                    <IonSelectOption value={TransactionType.EXPENSE}>Expense</IonSelectOption>
                    <IonSelectOption value={TransactionType.INCOME}>Income</IonSelectOption>
                  </IonSelect>
                )}
              />
            </IonItem>
            <ErrorMessage
              errors={errors}
              name="type"
              as={<IonNote className="error" />}
            />
            
            <IonItem>
              <Controller
                control={control}
                name="categoryId"
                rules={{ required: 'A category is required' }}
                render={({ field }) => (
                  <CategorySelectInput
                    labelPlacement="fixed"
                    label="Category"
                    value={field.value}
                    onChange={(value) => setValue("categoryId", value)}
                  />
                )}
              />
            </IonItem>
            <ErrorMessage
              errors={errors}
              name="categoryId"
              as={<IonNote className="error" />}
            />
            
            <IonItem>
              <IonLabel position="stacked">Amount ({CURRENCY_SYMBOLS[currency]})</IonLabel>
              <IonInput
                {...register("amount", { required: 'An amount is required' })}
                aria-label="Transaction amount"
                placeholder="0.00"
                step="0.01"
                type="number"
              />
            </IonItem>
            <ErrorMessage
              errors={errors}
              name="amount"
              as={<IonNote className="error" />}
            />
            
            <IonItem>
              <Controller
                control={control}
                name="registeredAt"
                rules={{ required: 'A date is required' }}
                render={({ field }) => (
                  <>
                    <IonLabel>Transaction date</IonLabel>
                    <IonDatetimeButton datetime={"registeredAt"} />
                    <IonModal keepContentsMounted>
                      <IonDatetime
                        {...register("registeredAt", { required: 'A date is required' })}
                        value={field.value?.toISOString() ?? undefined}
                        onIonChange={e => setValue("registeredAt", e.detail.value ? new Date(e.detail.value as string) : undefined)}
                        min={undefined}
                        max={undefined}
                        id={"registeredAt"}
                        presentation="date"
                      />
                    </IonModal>
                  </>
                )}
              />
            </IonItem>
            <ErrorMessage
              errors={errors}
              name="registeredAt"
              as={<IonNote className="error" />}
            />
            
            <IonItem>
              <IonLabel position="stacked">Origin</IonLabel>
              <IonInput
                {...register("origin")}
                aria-label="Transaction origin"
                placeholder="Where did the transaction come from?"
                type="text"
              />
            </IonItem>
            <ErrorMessage
              errors={errors}
              name="origin"
              as={<IonNote className="error" />}
            />
            
            <IonItem>
              <IonLabel position="stacked">Details</IonLabel>
              <IonInput
                {...register("details")}
                aria-label="Transaction details"
                placeholder="Any extra details about the transaction"
                type="text"
              />
            </IonItem>
            <ErrorMessage
              errors={errors}
              name="details"
              as={<IonNote className="error" />}
            />
            
            <IonItem>
              <IonLabel position="stacked">External ID</IonLabel>
              <IonInput
                {...register("externalId")}
                aria-label="External ID"
                placeholder="Transaction ID from the bank"
                type="text"
              />
            </IonItem>
            <ErrorMessage
              errors={errors}
              name="externalId"
              as={<IonNote className="error" />}
            />
          </IonList>
          <IonButton color="primary" expand="full" type="submit">
            Save Transaction
          </IonButton>
          <IonButton expand="full" fill="clear" onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
        </form>
      </IonContent>
    </IonModal>
  );
};
