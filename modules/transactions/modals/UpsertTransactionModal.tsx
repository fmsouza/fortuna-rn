import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import { View } from "react-native";

import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { CURRENCY_SYMBOLS, Currency } from "~/modules/accounts/constants";
import { Transaction } from "~/modules/transactions/types";
import { BottomSheet, DateSelectInput, DropdownInput, TextInput } from "~/modules/shared/components";

import { TransactionType } from "../constants";
import { CategorySelectInput } from "../components";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    padding: theme.dimensions.padding(),
    paddingBottom: theme.dimensions.padding(4),
  },
  row: {}
}));

type UpsertTransactionModalProps = {
  currency: Currency;
  onDismiss: (trx?: Maybe<Partial<Transaction>>) => void;
  transaction?: Maybe<Partial<Transaction>>;
  visible: boolean;
};

export function UpsertTransactionModal({ currency, onDismiss, transaction }: UpsertTransactionModalProps) {
  const styles = useStyles();

  const {
    handleSubmit,
    control,
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
    onDismiss(values);
  };

  return (
    <BottomSheet
      visible
      enableScroll
      onClose={onDismiss}
      snapPoints={['90%']}
      style={styles.root}
    >
      <View style={styles.row}>
        <TextInput
          control={control}
          name="title"
          label="Title"
          placeholder="Energy bill, groceries, etc."
          multiline
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <DropdownInput
          control={control}
          name="type"
          label="Type"
          placeholder="Income or Expense"
          options={[
            { label: 'Income', value: TransactionType.INCOME },
            { label: 'Expense', value: TransactionType.EXPENSE },
          ]}
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <CategorySelectInput
          control={control}
          name="categoryId"
          label="Category"
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          control={control}
          name="amount"
          label={`Amount (${CURRENCY_SYMBOLS[currency]})`}
          placeholder="0.00"
          keyboardType="numeric"
          inputMode="decimal"
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <DateSelectInput
          control={control}
          name="registeredAt"
          label="Transaction Date"
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          control={control}
          name="origin"
          label="Origin"
          placeholder="Where did the transaction come from?"
          multiline
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          control={control}
          name="details"
          label="Details"
          placeholder="Any extra details about the transaction"
          multiline
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          control={control}
          name="externalId"
          label="External ID"
          placeholder="Transaction ID from the bank"
          multiline
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>Save Transaction</Button>
      </View>
      <View style={styles.row}>
        <Button mode="text" onPress={() => onDismiss()}>Cancel</Button>
      </View>
    </BottomSheet>
  );
}