import { View } from "react-native";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

import { makeStyles } from "~/theme";
import { Maybe } from "~/modules/shared/types";
import { ActionSheet, Button, Text, TextInput } from "~/modules/shared/components";

import { useSaveAccount } from "../hooks";
import { Account, AccountInput } from "../types";

type NewAccountModalProps = {
  isOpen: boolean;
  account?: Maybe<Account>;
  onDismiss: () => void;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    marginBottom: theme.dimensions.padding,
    justifyContent: "space-evenly",
  },
  row: {
    marginVertical: theme.dimensions.padding,
  }
}));

export function NewAccountModal({ account, isOpen, onDismiss }: NewAccountModalProps) {
  const styles = useStyles();
  const {saveAccount, loading} = useSaveAccount();

  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
    reset,
  } = useForm<Partial<AccountInput>>({
    defaultValues: {
      title: '',
      currency: undefined,
      accountBankType: undefined,
    }
  });

  useEffect(() => {
    if (account) {
      reset(account);
    }
  }, [account]);

  const onSubmit = async (values: Partial<AccountInput>) => {
    saveAccount(
      {...values, id: account?.id },
      { onSuccess: onDismiss }
    );
  };

  return (
    <ActionSheet isOpen={isOpen} onDismiss={onDismiss} title="New Account" showCloseButton size={0.60}>
      <View style={styles.root}>
        <View style={styles.row}>
          <TextInput
            control={control}
            name="title"
            label="Account title"
            required
            errors={errors}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            control={control}
            name="currency"
            label="Currency"
            required
            errors={errors}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            control={control}
            name="accountBankType"
            label="Account Bank Type"
            required
            errors={errors}
          />
        </View>
        <View style={styles.row}>
          <Button onPress={handleSubmit(onSubmit)} title="Save Account" disabled={loading} />
        </View>
        <View style={styles.row}>
          <Button type="text" onPress={onDismiss} title="Cancel" disabled={loading} />
        </View>
      </View>
    </ActionSheet>
  );
}