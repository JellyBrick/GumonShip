import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export const Card: React.FC<{
  children: React.ReactNode,
  style: StyleProp<ViewStyle>,
}> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    marginHorizontal: 4,
    marginVertical: 6,
    shadowColor: '#333',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});