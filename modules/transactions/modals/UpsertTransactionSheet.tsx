import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";
import { View } from "react-native";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { CURRENCY_SYMBOLS, Currency } from "~/modules/accounts/constants";
import { Transaction } from "~/modules/transactions/types";
import {
  BottomSheet,
  DateSelectInput,
  DropdownInput,
  TextInput,
} from "~/modules/shared/components";

import { TransactionType } from "../constants";
import { CategorySelectInput } from "../components";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    padding: theme.dimensions.spacing(),
    paddingBottom: theme.dimensions.spacing(4),
  },
  row: {},
}));

type UpsertTransactionSheetProps = {
  currency: Currency;
  onDismiss: (trx?: Maybe<Partial<Transaction>>) => void;
  transaction?: Maybe<Partial<Transaction>>;
  visible: boolean;
};

export function UpsertTransactionSheet({
  currency,
  onDismiss,
  transaction,
}: UpsertTransactionSheetProps) {
  const styles = useStyles();
  const t = useText();

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
    },
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
      snapPoints={["90%"]}
      style={styles.root}
    >
      <View style={styles.row}>
        <TextInput
          control={control}
          name="title"
          label={t("screens.transactions.fields.title")}
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
          label={t("screens.transactions.fields.type")}
          placeholder={t("screens.transactions.fields.title")}
          options={[
            {
              label: t("screens.accountDetails.income"),
              value: TransactionType.INCOME,
            },
            {
              label: t("screens.accountDetails.expense"),
              value: TransactionType.EXPENSE,
            },
          ]}
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <CategorySelectInput
          control={control}
          name="categoryId"
          label={t("screens.transactions.fields.category")}
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          control={control}
          name="amount"
          label={t("screens.transactions.fields.amount", {
            currency: CURRENCY_SYMBOLS[currency],
          })}
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
          label={t("screens.transactions.fields.date")}
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          control={control}
          name="origin"
          label={t("screens.transactions.fields.origin")}
          placeholder={t("screens.transactions.whereDidYouGetThisFrom")}
          multiline
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          control={control}
          name="details"
          label={t("screens.transactions.fields.details")}
          multiline
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          control={control}
          name="externalId"
          label={t("screens.transactions.fields.externalId")}
          placeholder={t("screens.transactions.transactionExternalIdInfo")}
          multiline
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          {t("screens.transactions.actions.saveTransaction")}
        </Button>
      </View>
      <View style={styles.row}>
        <Button mode="text" onPress={() => onDismiss()}>
          {t("common.actions.cancel")}
        </Button>
      </View>
    </BottomSheet>
  );
}
