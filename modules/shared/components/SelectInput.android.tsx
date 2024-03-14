import { Control, Controller } from "react-hook-form";
import { View } from "react-native";

import { makeStyles } from "~/theme";

import { Text } from "./Text";
import { Picker } from "@react-native-picker/picker";

type Option = {
  label: string;
  value: string;
};

type SelectInputProps = {
  control: Control;
  name: string;
  label: string;
  placeholder?: string;
  options: Option[];
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
    paddingVertical: theme.dimensions.padding / 2,
    marginBottom: theme.dimensions.padding,
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

export function SelectInput({ control, name, label, placeholder, options, required, errors }: SelectInputProps) {
  const styles = useStyles();

  return (
    <Controller
      control={control}
      render={({ field: { onChange, value } }) => (
        <View style={styles.root}>
          <Text style={styles.label}>{label}</Text>
          <Picker
            mode="dropdown"
            placeholder={placeholder}
            selectedValue={value}
            onValueChange={onChange}>
            {options.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
          <Text style={styles.errorLabel}>{errors?.[name]?.type && 'This field is required'}</Text>
        </View>
      )}
      name={name}
      rules={{ required }}
      defaultValue=""
    />
  );
}
