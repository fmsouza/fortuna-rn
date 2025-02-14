import { View, Image } from "react-native";
import { Text } from "react-native-paper";

import { makeStyles } from "~/theme";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  image: {
    width: 250,
    opacity: 0.5,
    resizeMode: 'contain',
  },
  text: {
    maxWidth: 250,
    textAlign: "center",
    opacity: 0.5,
  }
}));

type NoItemsProps = {
  message: string;
};

export const NoItems: React.FC<NoItemsProps> = ({ message }) => {
  const styles = useStyles();
  return (
    <View style={styles.root}>
      <Image style={styles.image as any} source={require("~/assets/images/empty-wallet.png")} alt="Empty wallet image" />
      <Text variant="bodyLarge" style={styles.text}>{message}</Text>
    </View>
  );
};