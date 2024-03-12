import { StyleSheet, useColorScheme } from 'react-native';

import { Theme } from './types';
import { LightTheme } from './light';
import { DarkTheme } from './dark';

export function makeStyles<TStyles>(fn: (theme: Theme) => StyleSheet.NamedStyles<TStyles>) {
  return () => {
    const theme = useTheme();
    return StyleSheet.create(fn(theme));
  };
};

export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  return colorScheme === 'light' ? LightTheme : DarkTheme;
};