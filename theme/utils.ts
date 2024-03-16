import { StyleSheet } from 'react-native';
import { useTheme as useThemePaper, MD3Theme as ThemePaper } from 'react-native-paper';

import { ISharedBaseTheme } from './shared';

export type Theme = ThemePaper & ISharedBaseTheme;

export function makeStyles<TStyles>(fn: (theme: Theme) => StyleSheet.NamedStyles<TStyles>) {
  return () => {
    const theme = useThemePaper() as Theme;
    return StyleSheet.create(fn(theme));
  };
};
