import { Control, Controller } from "react-hook-form";
import { View } from "react-native";
import { TextInput as BaseTextInput, TextInputProps as BaseTextInputProps, HelperText } from 'react-native-paper';

import { makeStyles } from "~/theme";

type TextInputProps = BaseTextInputProps & {
  control: Control;
  name: string;
  label: string;
  required?: boolean;
  errors?: any;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
}));

export function TextInput({ control, name, label, required, errors, ...rest }: TextInputProps) {
  const styles = useStyles();

  return (
    <Controller
      control={control}
      render={({ field: { onChange, value, ...fieldProps } }) => (
        <View style={styles.root}>
          <BaseTextInput
            mode="outlined"
            label={label}
            onChangeText={onChange}
            value={value}
            {...rest}
            {...fieldProps}
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
