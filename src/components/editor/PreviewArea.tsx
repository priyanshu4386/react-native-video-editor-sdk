import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';
import { useEditorState } from '../../context/EditorStateContext';
import { CropMaskOverlay } from './CropMaskOverlay';

type Props = {
  source: string;
};

export const PreviewArea: React.FC<Props> = ({ source }) => {
  const videoRef = useRef<any>(null);
  const {
    setCurrentTime,
    setDuration,
    getTrim,
    getPlaybackState,
    isScrubbing,
  } = useEditorState();
  const { currentTime, duration } = getPlaybackState();
  console.log(
    '📹 PreviewArea - Current Time from state:',
    currentTime,
    'seconds, Duration: ',
    duration
  );

  React.useEffect(() => {
    if (isScrubbing && videoRef.current) {
      videoRef.current.seek(currentTime);
    }
  }, [currentTime, isScrubbing]);

  return (
    <View style={styles.container}>
      <View style={styles.portraitFrame}>
        <Video
          ref={videoRef}
          source={{ uri: source }}
          style={styles.video}
          resizeMode="contain"
          repeat={true}
          controls={true}
          onLoad={(e) => {
            setDuration(e.duration);
          }}
          onProgress={(e) => {
            const { start, end } = getTrim();
            let time = e.currentTime;

            if (!isScrubbing && time > end * e.seekableDuration) {
              videoRef.current?.seek(start * e.seekableDuration);
              time = start * e.seekableDuration;
            }

            if (!isScrubbing) {
              setCurrentTime(time);
            }
          }}
        />
        <CropMaskOverlay />
      </View>
    </View>
  );
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PREVIEW_HEIGHT = SCREEN_HEIGHT * 0.55;
const PREVIEW_MAX_WIDTH = SCREEN_WIDTH * 0.95; // 95% width with padding

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.025, // 2.5% padding on each side
  },
  portraitFrame: {
    width: '100%',
    maxWidth: PREVIEW_MAX_WIDTH,
    aspectRatio: 9 / 16,
    maxHeight: PREVIEW_HEIGHT * 0.9, // 90% of preview section height
    backgroundColor: '#000',
    overflow: 'hidden',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1c1c1e',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
