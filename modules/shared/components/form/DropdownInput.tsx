import { View } from "react-native";
import { Control, Controller } from "react-hook-form";
import { HelperText } from 'react-native-paper';

import { makeStyles } from "~/theme";

import { Dropdown, DropdownProps } from "./Dropdown";

type Option = {
  label: string;
  value: string;
};

type DropdownInputProps = Omit<DropdownProps, 'onChange'> & {
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
    width: theme.viewport.width - (theme.dimensions.spacing() * 2),
  }
}));

export function DropdownInput({ control, mode = 'outlined', name, options, required, errors, ...rest }: DropdownInputProps) {
  const styles = useStyles();

  return (
    <Controller
      control={control}
      render={({ field: { ref, ...fieldProps } }) => (
        <View style={styles.root}>
          <Dropdown
            {...rest}
            {...fieldProps}
            mode={mode}
            options={options}
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
