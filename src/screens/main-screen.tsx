import React, { useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import alsong from 'alsong';

import { Button, Modal, View, Text } from 'react-native';

import { RootStackParamList } from '../_types/root-stack-param-list';
import { useStateRef } from '../hooks/useStateRef';
import Song from '../components/song-data';

import type { SongInfo } from '../_types/song-info';

type MainScreenProps = {
  route: RouteProp<RootStackParamList, 'Main'>;
  navigation: StackNavigationProp<RootStackParamList, 'Main'>;
};

const MainScreen: React.FC<MainScreenProps> = ({ route, navigation }) => {
  const [lyric, setLyric] = useState<Record<number, string[]> | null>(null);
  const [songInfo, setSongInfo, songInfoGetter] = useStateRef<SongInfo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLyric, setCurrentLyric] = useState<string[]>([]);
  const { enteredUrl } = route.params;

  useEffect(() => {
    const timeUpdateInterval = setInterval(() => {
      const currentSongInfo = songInfoGetter();
      if (currentSongInfo?.elapsedSeconds) {
        currentSongInfo.elapsedSeconds += 0.15;
        if (currentSongInfo.artist === songInfoGetter()?.artist || currentSongInfo.title === songInfoGetter()?.title) {
          setSongInfo(currentSongInfo);
        }
      }
    }, 150);
    const fetchInterval = setInterval(() => {
      fetch(enteredUrl, {
        method: 'GET',
      }).then(async (it) => {
        const newSongInfo = (await it.json()) as SongInfo;
        const oldSongInfo = songInfoGetter();
        setSongInfo(newSongInfo);
        try {
          if (newSongInfo?.artist !== oldSongInfo?.artist || newSongInfo?.title !== oldSongInfo?.title) {
            const lyricSearchResult = await alsong(newSongInfo.artist, newSongInfo.title);
            if (lyricSearchResult.length > 0) {
              setLyric((await alsong.getLyricById(lyricSearchResult[0].lyricId))?.lyric ?? null);
            }
          }
        } catch (e) {
          console.error(e);
          setLyric(null);
        }
      });
    }, 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(timeUpdateInterval);
    };
  }, []);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ marginBottom: 10, textAlign: 'center' }}>
              이 가사를 GPT에게 물어볼까요?
            </Text>
            <Button
              title="예"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Chat', {
                  currentLyrics: currentLyric,
                  songName: songInfo?.title,
                  artistName: songInfo?.artist,
                });
              }}
            />
            <Button
              title="아니요"
              onPress={() => {
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <Song
        apiUrl={enteredUrl}
        lyric={lyric}
        songName={songInfo?.title ?? ''}
        imageUrl={songInfo?.imageSrc ?? 'https://picsum.photos/300/300'}
        artistName={songInfo?.artist ?? ''}
        currentSeekBarValue={songInfo?.elapsedSeconds ?? 0}
        maxSeekBarValue={songInfo?.songDuration ?? 0}
        isPaused={songInfo?.isPaused ?? false}
        onSeekBarChange={(value: number) => {
          fetch(enteredUrl + '?action=seek&value=' + Math.floor(value), {
            method: 'GET',
          });
        }}
        onLyricPress={(currentPosition) => {
          console.log('Seeking to ' + Math.floor(currentPosition));
          fetch(enteredUrl + '?action=seek&value=' + Math.floor(currentPosition), {
            method: 'GET',
          });
        }}
        onLyricLongPress={(_, currentLyrics) => {
          setCurrentLyric(currentLyrics);
          setModalVisible(true);
        }}
      />
    </>
  );
};

export default MainScreen;
