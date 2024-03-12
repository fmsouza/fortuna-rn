import { useNavigation } from "expo-router";
import { useEffect } from "react";

export function useHeaderOptions(options: Partial<{}>) {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions(options);
  }, [navigation, options]);
}