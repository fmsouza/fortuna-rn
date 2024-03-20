import "reflect-metadata";
import { Slot } from "expo-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { en, registerTranslation } from "react-native-paper-dates";

import { ThemeProvider } from "~/theme/provider";

registerTranslation("en", en);

dayjs.extend(customParseFormat);

export const queryClient = new QueryClient();

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Slot />
          </ThemeProvider>
        </QueryClientProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
