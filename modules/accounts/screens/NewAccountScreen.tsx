import { useEffect } from "react";
import { Button, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  PaperProvider,
  ProgressBar,
  Snackbar,
  useTheme,
} from "react-native-paper";

import { useText } from "~/intl";
import { makeStyles } from "~/theme";
import { useHeaderOptions } from "~/modules/shared/navigation";
import {
  Container,
  DropdownInput,
  HeaderButton,
  TextInput,
} from "~/modules/shared/components";
import { IS_ANDROID, IS_IOS } from "~/modules/shared/constants";

import { AccountInput } from "../types";
import {
  ACCOUNT_BANK_TYPE_LABELS,
  AccountBankType,
  Currency,
} from "../constants";
import { useAccount, useSaveAccount } from "../hooks";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginHorizontal: 8,
  },
  row: {
    marginVertical: theme.dimensions.spacing(),
  },
}));

export function NewAccountScreen() {
  const router = useRouter();
  const styles = useStyles();
  const t = useText();
  const params = useLocalSearchParams();
  const accountId = params.account ? Number(params.account) : undefined;
  const { account } = useAccount(accountId);
  const { saveAccount, loading, error } = useSaveAccount();
  const theme = useTheme();

  useHeaderOptions({
    title: t("screens.newAccount.title"),
    presentation: IS_IOS && "modal",
    headerLeft: () => (
      <HeaderButton
        title={t("common.actions.close")}
        icon="close"
        onPress={router.back}
      />
    ),
    headerRight: () => (
      <HeaderButton
        title={t("common.actions.save")}
        icon="content-save"
        onPress={handleSubmit(onSubmit)}
      />
    ),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<Partial<AccountInput>>({
    defaultValues: {
      title: "",
      currency: undefined,
      accountBankType: undefined,
    },
  });

  useEffect(() => {
    if (account) {
      reset(account);
    }
  }, [account]);

  const onSubmit = async (values: Partial<AccountInput>) => {
    saveAccount({ ...values, id: account?.id } as AccountInput, {
      onSuccess: router.back,
    });
  };

  const accountBankTypeOptions = Object.values(AccountBankType).map(
    (bankType) => ({
      label: ACCOUNT_BANK_TYPE_LABELS[bankType],
      value: bankType,
    })
  );

  const currencyOptions = Object.values(Currency).map((currency) => ({
    label: currency,
    value: currency,
  }));

  return (
    <PaperProvider theme={theme}>
      {loading && <ProgressBar indeterminate />}
      <Snackbar visible={error !== null} onDismiss={() => {}}>
        {error?.message}
      </Snackbar>
      <Container style={styles.root}>
        <View style={styles.row}>
          <TextInput
            control={control}
            name="title"
            label={t("screens.newAccount.fields.accountTitle")}
            required
            errors={errors}
          />
        </View>
        <View style={styles.row}>
          <DropdownInput
            control={control}
            name="accountBankType"
            label={t("screens.newAccount.fields.bankType")}
            placeholder="Wise, N26, Revolut, etc"
            options={accountBankTypeOptions}
            required
            errors={errors}
          />
        </View>
        <View style={styles.row}>
          <DropdownInput
            control={control}
            name="currency"
            label={t("screens.newAccount.fields.accountCurrency")}
            placeholder="USD, EUR, etc"
            options={currencyOptions}
            required
            errors={errors}
          />
        </View>
        {IS_ANDROID && (
          <>
            <View style={styles.row}>
              <Button
                onPress={handleSubmit(onSubmit)}
                title={t("screens.newAccount.actions.saveAccount")}
                disabled={loading}
              />
            </View>
          </>
        )}
      </Container>
    </PaperProvider>
  );
}
