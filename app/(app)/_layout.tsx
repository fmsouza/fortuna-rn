import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        // TODO: Dark mode
        headerTintColor: 'black',
      }}
    />
  );
}