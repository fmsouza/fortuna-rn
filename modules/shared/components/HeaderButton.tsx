import { Link } from "expo-router";
import { Button } from "react-native";
import { IconButton } from "react-native-paper";

import { IS_IOS } from "../constants";

type BaseHeaderButtonProps = {
  title: string;
  icon: string;
};

type HeaderButtonWithLinkProps = BaseHeaderButtonProps & {
  onPress?: never;
  link?: string;
};

type HeaderButtonWithPressProps = BaseHeaderButtonProps & {
  onPress?: () => void;
  link?: never;
};

type HeaderButtonProps = HeaderButtonWithLinkProps | HeaderButtonWithPressProps;

export function HeaderButton({ icon, title, onPress = () => {}, link = '' }: HeaderButtonProps) {
  return (
    <Link href={link} asChild>
      {IS_IOS ? <Button title={title} onPress={onPress} /> : <IconButton icon={icon} onPress={onPress} />}
    </Link>
  );
}