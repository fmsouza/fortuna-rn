import { StatusBarProps } from 'react-native';

export type Theme = {
  statusBar: StatusBarProps;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    invertedText: string;
    border: string;
    notification: string;
  };
  viewport: {
    width: number;
    height: number;
  };
  dimensions: {
    padding: number;
    margin: number;
    radius: number;
    border: number;
  };
  text: {
    baseSize: number;
    header: number;
  };
  navbar: Partial<{
    headerStyle: Partial<{}>;
    headerTintColor?: string;
    headerTitleStyle: Partial<{}>;
  }>
};