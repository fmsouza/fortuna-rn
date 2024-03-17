import { useState } from "react";
import { View } from "react-native";
import { TextInput, TextInputProps } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';

export type DateSelectProps = Omit<TextInputProps, 'onChangeText'> & {
  onChange: (value?: Date) => void;
};

export function DateSelect({ mode = 'outlined', onChange, ...props }: DateSelectProps) {
  const [visible, setVisible] = useState(false);

  const date = props.value ? new Date(props.value) : new Date();

  return (
    <View>
      <TextInput
        {...props}
        value={date.toLocaleDateString()}
        mode={mode}
        editable={false}
        onPressIn={() => setVisible(true)}
        right={<TextInput.Icon icon="calendar" onPress={() => setVisible(v => !v)} />}
      />
      <DatePickerModal
        locale="en"
        mode="single"
        visible={visible}
        onDismiss={() => setVisible(false)}
        date={date}
        onConfirm={({date}) => {
          onChange(date);
          setVisible(false);
        }}
      />
    </View>
  );
}
