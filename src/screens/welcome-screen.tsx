import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '../_types/root-stack-param-list';

type WelcomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Welcome'>;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [url, setUrl] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter API Server URL"
        onChangeText={(text) => setUrl(text)}
        value={url}
      />
      <Button
        title="OK"
        onPress={() => navigation.navigate('Main', { enteredUrl: url })}
      />
    </SafeAreaView>
  );
};

const gray = 'gray';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderColor: gray,
    borderWidth: 1,
    height: 40,
    marginBottom: 20,
    padding: 10,
  },
});

export default WelcomeScreen;
