import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, StyleSheet, FlatList, Button, KeyboardAvoidingView, Platform } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { RootStackParamList } from '../_types/root-stack-param-list';
import ChatBubble from '../components/chat-bubble';
import { chatGPTApi } from '../constants/chatgpt';
import { useStateRef } from '../hooks/useStateRef';

const ChatScreen: React.FC<{
  route: RouteProp<RootStackParamList, 'Chat'>;
}> = ({ route }) => {
  const { currentLyrics } = route.params;
  const [messages, setMessages, getMessages] = useStateRef<Array<{id: number, text: string, sender: 'user' | 'gpt'}>>([
    { id: Date.now(), text: currentLyrics.join('\n') + '\n\n위 가사에서 어떤 부분이 궁금하신가요?', sender: 'gpt' },
  ]);
  const [currentText, setCurrentText] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(true);

  const sendMessage = (text: string) => {
    setMessages([...getMessages(), { id: Date.now(), text, sender: 'user' }]);
    setShowInput(false);
    chatGPTApi.sendMessage({
      model: 'gpt-3.5-turbo-instruct',
      prompt: '저는 지금 노래를 듣고 있고, 당신은 OpenAI사에서 개발한 ChatGPT입니다. ' +
        '가사는 3줄인 경우 원문, 발음, 해석으로 구성되어 있으며, ' +
        '2줄인 경우 원문, 해석으로 구성되어 있거나 원문, 발음으로 구성되어 있습니다. ' +
        '1줄인 경우 원문으로 구성되어 있습니다. ' +
        '가사는' + currentLyrics.join('\n') + '입니다. ' +
        (route.params.songName && '노래의 제목은 ' + route.params.songName + '이고, ') +
        (route.params.artistName && '작곡가 혹은 아티스트는 ' + route.params.artistName + '입니다.') +
        '\n질문하겠습니다. 가사의 내용에 대해 답변을 해주십시오.\n' + text,
      max_tokens: 1024,
    }).then((response) => {
      setMessages([...getMessages(), { id: Date.now(), text: response.choices.at(0)?.text?.trim() ?? '응답이 없습니다.', sender: 'gpt' }]);
      setShowInput(true);
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 85 : 0}
      >
        <FlatList
          data={messages}
          renderItem={({ item }) => <ChatBubble message={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
        {showInput && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onSubmitEditing={(e) => sendMessage(e.nativeEvent.text)}
              onChangeText={(text) => setCurrentText(text)}
            />
            <Button title="Send" onPress={() => sendMessage(currentText)} />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  input: {
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    height: 40,
    marginRight: 10,
    padding: 10
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ChatScreen;