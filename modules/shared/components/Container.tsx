import React, { ReactNode } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

import { makeStyles, Theme } from '~/theme';

const useStyles = makeStyles((theme: Theme) => ({
  safeWrapper: {
    flex: 1,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.dimensions.padding,
  },
}));

type ContainerProps = {
  style?: any;
  children: ReactNode;
};

export const Container = ({ children, style }: ContainerProps) => {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.safeWrapper}>
      <View style={StyleSheet.flatten([styles.container, style])}>
        {children}
      </View>
    </SafeAreaView>
  );
};
