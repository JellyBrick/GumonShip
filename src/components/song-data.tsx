import React, { useEffect, useMemo, useRef } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, Pressable, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

import { Card } from './card';

export default ({
  apiUrl = '',
  lyric = null,
  imageUrl = '',
  songName = 'Song Name',
  artistName = 'Artist Name',
  currentSeekBarValue = 0,
  maxSeekBarValue = 100,
  isPaused = false,
  onSeekBarChange = () => {},
  onLyricPress = () => {},
  onLyricLongPress = () => {},
}: {
  apiUrl: string,
  lyric: Record<number, string[]> | null,
  imageUrl: string,
  songName: string,
  artistName: string,
  currentSeekBarValue: number,
  maxSeekBarValue: number,
  isPaused: boolean,
  onSeekBarChange: (value: number) => void,
  onLyricPress: (value: number, currentLyric: string[]) => void,
  onLyricLongPress: (value: number, currentLyric: string[]) => void,
}) => {
  const currentLyric = useMemo(() => {
    if (lyric) {
      const lyricEntries = Object.entries(lyric);
      for (let i = 0; i < lyricEntries.length; i++) {
        const nextIndex = lyricEntries.at(i + 1)?.at(0) as string | undefined;
        if (!nextIndex) {
          return lyricEntries[i][1];
        }
        if (parseInt(nextIndex) > (currentSeekBarValue * 1000) + 600 /* scroll delay */) {
          return lyricEntries[i][1];
        }
      }
    }
    return null;
  }, [lyric, currentSeekBarValue]);

  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (currentLyric) {
      // Get the index of the current lyric
      const currentIndex = lyric ? Object.values(lyric).indexOf(currentLyric) : -1;
      if (currentIndex !== -1 && scrollViewRef.current) {
        const yOffset = currentIndex * 80; // assume each lyric+blank line occupies approx 80 units of height
        scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
      }
    }
  }, [currentLyric]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
          />
        </View>
        <View style={styles.songInfo}>
          <Text style={styles.songName}>{songName}</Text>
          <Text style={styles.artistName}>{artistName}</Text>
        </View>
        <ScrollView ref={scrollViewRef} style={{ flex: 1 }}>
          <View style={styles.lyrics}>
            {lyric && Object.entries(lyric)?.map(([time, lines], index) => (
              <Card key={index} style={styles.lyricCard}>
                <Pressable
                  key={index}
                  onPress={() => onLyricPress(Number(time) / 1000, lines)}
                  onLongPress={() => onLyricLongPress(Number(time) / 1000, lines)}
                >
                  <Text style={[
                    styles.lyricsText,
                    currentLyric === lines ? styles.currentLyric : null
                  ]}>
                    {lines.join('\n')}
                  </Text>
                  <Text style={styles.lyricBreak}>{'\n'}</Text>
                </Pressable>
              </Card>
            ))}
          </View>
        </ScrollView>
      </View>
      <Slider
        style={styles.seekBar}
        value={currentSeekBarValue}
        maximumValue={maxSeekBarValue}
        onValueChange={onSeekBarChange}
      />
      <View style={styles.controls}>
        <Card style={styles.controlCard}>
          <Pressable
            style={styles.controlButton}
            onPress={() => {
              fetch(apiUrl + '?action=previous', {
                method: 'GET',
              });
            }}
          >
            <AntDesign
              name="stepbackward"
              size={24}
              color="black"
            />
          </Pressable>
        </Card>
        <Card style={styles.controlCard}>
          <Pressable
            style={styles.controlButton}
            onPress={() => {
              fetch(apiUrl + '?action=play', {
                method: 'GET',
              })
            }}
          >
            {isPaused ? (
              <AntDesign name="caretright" size={24} color="black" />
            ) : (
              <MaterialCommunityIcons name="pause" size={24} color="black" />
            )}
          </Pressable>
        </Card>
        <Card style={styles.controlCard}>
          <Pressable
            style={styles.controlButton}
            onPress={() => {
              fetch(apiUrl + '?action=next', {
                method: 'GET',
              })
            }}
          >
            <AntDesign name="stepforward" size={24} color="black" />
          </Pressable>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  artistName: {
    color: '#888',
    fontSize: 12
  },
  container: {
    backgroundColor: '#FFF',
    flex: 1
  },
  content: {
    flex: 1,
    padding: 16
  },
  controlButton: {
    marginHorizontal: 8
  },
  controlCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  controls: {
    borderColor: '#EEE',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16
  },
  currentLyric: {
    color: 'blue',
    fontWeight: 'bold'
  },
  image: {
    borderRadius: 8,
    height: 150,
    width: 150
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  lyricBreak: {
    height: 20,
  },
  lyricCard: {
    padding: 8,
    paddingBottom: 0,
  },
  lyrics: {
    alignItems: 'center',
    marginTop: 16
  },
  lyricsText: {
    color: '#888',
    fontSize: 12
  },
  seekBar: {
    margin: 10,
  },
  songInfo: {
    alignItems: 'center',
    marginTop: 16
  },
  songName: {
    fontSize: 24,
    fontWeight: 'bold'
  },
});
