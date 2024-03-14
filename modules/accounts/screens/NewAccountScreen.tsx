import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button, Container, HeaderButton, IconButton, SelectInput, TextInput } from '~/modules/shared/components';
import { useHeaderOptions } from '~/modules/shared/navigation';
import { makeStyles } from '~/theme';
import { useAccount, useSaveAccount } from '../hooks';
import { useForm } from 'react-hook-form';
import { AccountInput } from '../types';
import { useEffect } from 'react';
import { ACCOUNT_BANK_TYPE_LABELS, AccountBankType, Currency } from '../constants';
import { IS_ANDROID, IS_IOS } from '~/modules/shared/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  row: {
    marginVertical: theme.dimensions.padding,
  }
}));

export function NewAccountScreen() {
  const router = useRouter();
  const styles = useStyles();
  const {accountId} = useLocalSearchParams();
  const { account } = useAccount(accountId as string);
  const {saveAccount, loading} = useSaveAccount();
  
  useHeaderOptions({
    title: 'New Account',
    presentation: IS_IOS && 'modal',
    headerLeft: () => IS_IOS ? <HeaderButton title='Cancel' onPress={router.back} /> : <IconButton name='arrow-back' mdIcon onPress={router.back} />,
    headerRight: () => IS_IOS ? <HeaderButton title='Save' onPress={handleSubmit(onSubmit)} /> : <HeaderButton title='x' onPress={router.back} />,
  });

  const {
    handleSubmit,
    control,
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
      {
        onSuccess: router.back,
      }
    );
  };

  const accountBankTypeOptions = Object.values(AccountBankType).map(bankType => ({
    label: ACCOUNT_BANK_TYPE_LABELS[bankType],
    value: bankType,
  }));

  const currencyOptions = Object.values(Currency).map(currency => ({
    label: currency,
    value: currency,
  }));

  return (
    <Container style={styles.root}>
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
        <SelectInput
          control={control}
          name="accountBankType"
          label="Bank type"
          placeholder="Wise, N26, Revolut, etc"
          options={accountBankTypeOptions}
          required
          errors={errors}
        />
      </View>
      <View style={styles.row}>
        <SelectInput
          control={control}
          name="currency"
          label="Account currency"
          placeholder="USD, EUR, etc"
          options={currencyOptions}
          required
          errors={errors}
        />
      </View>
      {IS_ANDROID && (
        <>
          <View style={styles.row}>
            <Button onPress={handleSubmit(onSubmit)} title="Save Account" disabled={loading} />
          </View>
          <View style={styles.row}>
            <Button type="text" title="Cancel" disabled={loading} onPress={router.back} />
          </View>
        </>
      )}
    </Container>
  );
}
