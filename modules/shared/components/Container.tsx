import React, { ReactNode } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { makeStyles } from '~/theme';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.dimensions.spacing(),
  },
}));

type ContainerProps = {
  style?: any;
  children: ReactNode;
};

export const Container = ({ children, style }: ContainerProps) => {
  const styles = useStyles();

  return (
    <SafeAreaView style={StyleSheet.flatten([styles.root, style])}>
      {children}
    </SafeAreaView>
  );
};
