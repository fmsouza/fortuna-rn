import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import { deepMerge } from "~/modules/shared/utils";
import { useAppPreference } from "~/modules/settings/hooks";
import { AppPreferences } from "~/modules/settings/constants";

import { SharedBaseTheme } from "./shared";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = deepMerge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = deepMerge(MD3DarkTheme, DarkTheme);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { appPreference: darkModePreference, loading } = useAppPreference(
    AppPreferences.DARK_MODE
  );
  const isSystemDarkMode = useColorScheme() === "dark";
  const isDarkModePreferenceEnabled = Boolean(darkModePreference?.value);

  if (loading) {
    return null;
  }

  const isDarkModeEnabled = isDarkModePreferenceEnabled
    ? true
    : isSystemDarkMode;

  const theme = isDarkModeEnabled ? CombinedDarkTheme : CombinedDefaultTheme;
  const extendedTheme = deepMerge(theme, SharedBaseTheme);

  return (
    <PaperProvider theme={extendedTheme}>
      <NavigationThemeProvider value={extendedTheme}>
        <StatusBar style="auto" />
        {children}
      </NavigationThemeProvider>
    </PaperProvider>
  );
}
