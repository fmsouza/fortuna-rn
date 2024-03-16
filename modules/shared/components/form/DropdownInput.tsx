import { useRef, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { View } from "react-native";
import { TextInput as BaseTextInput, TextInputProps as BaseTextInputProps, HelperText, Menu, useTheme } from 'react-native-paper';

import { makeStyles } from "~/theme";

type Option = {
  label: string;
  value: string;
};

type DropdownInputProps = BaseTextInputProps & {
  control: Control;
  name: string;
  options: Option[];
  required?: boolean;
  errors?: any;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  menu: {
    marginTop: -68,
    width: theme.viewport.width - (theme.dimensions.padding() * 2),
  }
}));

export function DropdownInput({ control, mode = 'outlined', name, options, required, errors, ...rest }: DropdownInputProps) {
  const styles = useStyles();
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      control={control}
      render={({ field: { onChange, ...fieldProps } }) => (
        <View style={styles.root}>
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            style={styles.menu}
            anchor={
              <BaseTextInput
                {...rest}
                {...fieldProps}
                mode={mode}
                onChangeText={onChange}
                editable={false}
                onPressIn={() => setVisible(true)}
                right={<BaseTextInput.Icon icon={visible ? "menu-up" : "menu-down"} onPress={() => setVisible(v => !v)} />}
              />
            }>
              {options.map((option, index) => (
                <Menu.Item key={index} onPress={() => { onChange(option.value); setVisible(false); }} title={option.label} />
              ))}
            </Menu>
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
