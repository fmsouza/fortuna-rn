import { Dimensions } from 'react-native';

import { DeepPartial } from '~/modules/shared/types';

import { Theme } from './types';

const { width: maxWidth, height: maxHeight } = Dimensions.get('window');

const colors = {
  primary: 'rgb(0, 122, 255)',
  secondary: 'rgb(0, 122, 255)',
  background: 'rgb(242, 242, 242)',
  card: 'rgb(255, 255, 255)',
  text: 'rgb(28, 28, 30)',
  border: 'rgb(216, 216, 216)',
  notification: 'rgb(255, 59, 48)',
}

const viewport = {
  width: maxWidth,
  height: maxHeight
};

const dimensions = {
  padding: 8,
  margin: 8,
  radius: 4,
  border: 2,
};

const text = {
  baseSize: 14,
  header: 16,
};

const navbar = {
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: text.header
  }
};

export const SharedBaseTheme: DeepPartial<Theme> = {
  colors,
  viewport,
  dimensions,
  text,
  navbar
};