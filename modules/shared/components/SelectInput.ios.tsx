import { Control, Controller } from "react-hook-form";
import { Modal, Pressable, View } from "react-native";

import { makeStyles } from "~/theme";

import { Text } from "./Text";
import { Picker } from "@react-native-picker/picker";
import { IconButton } from "./Icon";
import { useState } from "react";
import { ActionSheet } from "./ActionSheet";

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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  pickerModalContainer: {
    flex: 1,
  }
}));

export function SelectInput({ control, name, label, placeholder, options, required, errors }: SelectInputProps) {
  const styles = useStyles();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Controller
      control={control}
      render={({ field: { onChange, value } }) => (
        <View style={styles.root}>
          <Text style={styles.label}>{label}</Text>
          <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
            <Text>{value ?? placeholder}</Text>
            <IconButton name="chevron-down" onPress={() => setShowPicker(true)} />
          </Pressable>
          <ActionSheet isOpen={showPicker} onDismiss={() => setShowPicker(false)} title={label} size={0.4}>
            <View style={styles.pickerModalContainer}>
              <Picker
                mode="dropdown"
                placeholder={placeholder}
                selectedValue={value}
                onValueChange={item => {
                  onChange(item);
                  setShowPicker(false);
                }}>
                {options.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </ActionSheet>
          <Text style={styles.errorLabel}>{errors?.[name]?.type && 'This field is required'}</Text>
        </View>
      )}
      name={name}
      rules={{ required }}
      defaultValue=""
    />
  );
}
