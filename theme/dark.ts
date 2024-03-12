import { StatusBarStyle } from 'react-native';
import color from 'color';
import merge from 'lodash/merge';

import { Theme } from './types';
import { SharedBaseTheme } from './shared';

const COLORS = {
  primary: '#004FFF',
  secondary: '#FF007F',
  background: '#050505',
  text: '#FCFCFC',
  invertedText: '#050505',
  border: '#FCFCFC',
};

const STATUS_BAR = {
  barStyle: 'light-content' as StatusBarStyle,
  backgroundColor: color(COLORS.primary).darken(0.4).hex().toString(),
};

export const DarkTheme = <Theme>merge(SharedBaseTheme, {
  colors: COLORS,
  statusBar: STATUS_BAR,
  navbar: {
    headerStyle: {
      backgroundColor: COLORS.background,
    },
  }
});