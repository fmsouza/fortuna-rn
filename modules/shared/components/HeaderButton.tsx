import { Link } from "expo-router";
import { Button } from "react-native";

type BaseHeaderButtonProps = {
  title: string;
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

export function HeaderButton({ title, onPress = () => {}, link = '' }: HeaderButtonProps) {
  return (
    <Link href={link} asChild>
      <Button title={title} onPress={onPress} />
    </Link>
  );
}