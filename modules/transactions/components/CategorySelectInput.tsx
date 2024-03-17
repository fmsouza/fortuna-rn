import { View } from "react-native";
import { Control, Controller } from "react-hook-form";
import { HelperText } from 'react-native-paper';

import { makeStyles } from "~/theme";

import { CategorySelect, CategorySelectProps } from "./CategorySelect";

type CategorySelectInputProps = Omit<CategorySelectProps, 'onChange'> & {
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
  menu: {
    marginTop: -68,
    width: theme.viewport.width - (theme.dimensions.spacing() * 2),
  }
}));

export function CategorySelectInput({ control, mode = 'outlined', name, required, errors, ...rest }: CategorySelectInputProps) {
  const styles = useStyles();

  return (
    <Controller
      control={control}
      render={({ field: { ...fieldProps } }) => (
        <View style={styles.root}>
          <CategorySelect
            {...rest}
            {...fieldProps}
            mode={mode}
            categoryId={fieldProps.value}
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
