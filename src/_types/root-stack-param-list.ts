export type RootStackParamList = {
  Welcome: undefined; // no params
  Main: { enteredUrl: string };
  Chat: {
    currentLyrics: string[],
    songName?: string,
    artistName?: string,
  };
};