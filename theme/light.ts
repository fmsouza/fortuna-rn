import { StatusBarStyle } from 'react-native';
import color from 'color';

import { deepMerge } from '~/modules/shared/utils';

import { SharedBaseTheme } from './shared';

const COLORS = {
  primary: '#004FFF',
  secondary: '#FF007F',
  background: '#FCFCFC',
  text: '#050505',
  invertedText: '#FCFCFC',
  border: '#DDDDDD',
};

const STATUS_BAR = {
  barStyle: 'light-content' as StatusBarStyle,
  backgroundColor: color(COLORS.primary).darken(0.4).hex().toString(),
};

export const LightTheme = deepMerge(SharedBaseTheme, {
  colors: COLORS,
  statusBar: STATUS_BAR,
  navbar: {
    headerStyle: {
      backgroundColor: COLORS.background,
    },
  }
});