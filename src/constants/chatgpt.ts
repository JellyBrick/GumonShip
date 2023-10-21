import { ChatGPTApi } from 'chatgpt-api-client';

export const chatGPTApi = new ChatGPTApi({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY!,
});
