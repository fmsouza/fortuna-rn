import { View } from "react-native";
import { Control, Controller } from "react-hook-form";
import { HelperText } from 'react-native-paper';

import { makeStyles } from "~/theme";

import { DateSelect, DateSelectProps } from "./DateSelect";

type DateSelectInputProps = Omit<DateSelectProps, 'onChange'> & {
  control: Control;
  name: string;
  required?: boolean;
  errors?: any;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

export function DateSelectInput({ control, mode = 'outlined', name, required, errors, ...rest }: DateSelectInputProps) {
  const styles = useStyles();

  return (
    <Controller
      control={control}
      render={({ field: { ...fieldProps } }) => (
        <View style={styles.root}>
          <DateSelect
            {...rest}
            {...fieldProps}
            mode={mode}
          />
          <HelperText type="error" visible={errors?.[name]?.type ?? false}>
            This field is required
          </HelperText>
        </View>
      )}
      name={name}
      rules={{ required }}
      defaultValue=""
    />
  );
}
