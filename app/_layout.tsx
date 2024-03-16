import 'reflect-metadata';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Slot } from 'expo-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from 'react-native-paper';

import { deepMerge } from '~/modules/shared/utils';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = deepMerge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = deepMerge(MD3DarkTheme, DarkTheme);

dayjs.extend(customParseFormat);

export const queryClient = new QueryClient();

export default function Layout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;
  return (
    <PaperProvider theme={theme}>
      <NavigationThemeProvider value={theme}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="auto" />
          <Slot />
        </QueryClientProvider>
      </NavigationThemeProvider>
    </PaperProvider>
  );
}
