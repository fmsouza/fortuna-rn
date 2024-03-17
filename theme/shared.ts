import { Dimensions } from 'react-native';

const { width: maxWidth, height: maxHeight } = Dimensions.get('window');

const viewport = {
  width: maxWidth,
  height: maxHeight
};

const dimensions = {
  spacing: (x = 1) => 8 * x,
  radius: (x = 1) => 2 * x,
  border: (x = 1) => 1 * x,
};

export const SharedBaseTheme = {
  viewport,
  dimensions,
};

export type ISharedBaseTheme = typeof SharedBaseTheme;