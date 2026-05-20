import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type ScreenProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export default function Screen({ children, style }: ScreenProps) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
