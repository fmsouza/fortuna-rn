import { useNavigation } from "expo-router";
import { useEffect } from "react";

export function useHeaderOptions(props: Partial<{}>) {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ ...props });
  }, [navigation]);
}