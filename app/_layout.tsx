import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { QueryClientProvider, QueryClient } from 'react-query';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Slot />
    </QueryClientProvider>
  );
}
