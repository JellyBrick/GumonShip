import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'gpt';
};

type ChatBubbleProps = {
  message: Message;
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.gptContainer]}>
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '70%',
    padding: 10
  },
  gptContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  text: {
    color: 'white'
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#0a74db',
  },
});

export default ChatBubble;