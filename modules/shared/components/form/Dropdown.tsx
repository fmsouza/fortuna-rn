import { useState } from "react";
import { TextInput, TextInputProps, Menu } from "react-native-paper";

import { makeStyles } from "~/theme";

type Option = {
  label: string;
  value: string;
};

export type DropdownProps = Omit<
  TextInputProps,
  "onChangeText" | "onChange"
> & {
  onChange: (value: string) => void;
  options: Option[];
};

const useStyles = makeStyles(() => ({
  menuItem: {
    width: "100%",
  },
}));

export function Dropdown({
  mode = "outlined",
  onChange,
  options,
  ...props
}: DropdownProps) {
  const styles = useStyles();
  const [visible, setVisible] = useState(false);

  const selectedOption = options.find((option) => option.value === props.value);

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchorPosition="bottom"
      anchor={
        <TextInput
          {...props}
          mode={mode}
          editable={false}
          onPressIn={() => setVisible(true)}
          onChangeText={onChange}
          value={selectedOption?.label}
          right={
            <TextInput.Icon
              icon={visible ? "menu-up" : "menu-down"}
              onPress={() => setVisible((v) => !v)}
            />
          }
        />
      }
    >
      {options.map((option, index) => (
        <Menu.Item
          contentStyle={styles.menuItem}
          key={index}
          onPress={() => {
            onChange(option.value);
            setVisible(false);
          }}
          title={option.label}
        />
      ))}
    </Menu>
  );
}
