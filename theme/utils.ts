import { StyleSheet } from 'react-native';
import { useTheme as useThemePaper, MD3Theme as ThemePaper } from 'react-native-paper';

import { ISharedBaseTheme } from './shared';

export function makeStyles<TStyles>(fn: (theme: ThemePaper & ISharedBaseTheme) => StyleSheet.NamedStyles<TStyles>) {
  return () => {
    const theme = useThemePaper() as ThemePaper & ISharedBaseTheme;
    return StyleSheet.create(fn(theme));
  };
};
