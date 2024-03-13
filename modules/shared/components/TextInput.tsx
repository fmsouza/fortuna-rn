import { Control, Controller } from "react-hook-form";
import { View, TextInput as BaseTextInput, TextInputProps as BaseTextInputProps } from "react-native";

import { makeStyles } from "~/theme";

import { Text } from "./Text";
import { ErrorMessage } from "@hookform/error-message";

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
    marginBottom: theme.dimensions.padding,
  },
  label: {
    fontSize: theme.text.baseSize,
    marginBottom: theme.dimensions.padding / 2,
  },
  input: {
    padding: theme.dimensions.padding,
    backgroundColor: theme.colors.background,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    borderRadius: theme.dimensions.radius,
    fontSize: theme.text.baseSize,
  },
  errorLabel: {
    color: 'red',
    fontSize: theme.text.baseSize * 0.8,
  },
}));

export function TextInput({ control, name, label, required, errors, ...rest }: TextInputProps) {
  const styles = useStyles();

  return (
    <Controller
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <View style={styles.root}>
          <Text style={styles.label}>{label}</Text>
          <BaseTextInput
            style={styles.input}
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            {...rest}
          />
          <ErrorMessage
            errors={errors}
            name={name}
            as={<Text style={styles.errorLabel} />}
          />
        </View>
      )}
      name={name}
      rules={{ required }}
      defaultValue=""
    />
  );
}
