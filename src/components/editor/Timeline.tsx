import { useRef, useState } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { useEditorState } from '../../context/EditorStateContext';
import { useEditorContext } from '../../context/EditorContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 24;
const TIMELINE_WIDTH = SCREEN_WIDTH - PADDING * 2;
const HANDLE_WIDTH = 20;

export const Timeline = () => {
  // ✅ ALL HOOKS FIRST (always)
  const { activeTool } = useEditorContext();
  const {
    setTrim,
    getPlaybackState,
    setCurrentTime,
    stopScrubbing,
    startScrubbing,
  } = useEditorState();

  const [leftPos, setLeftPos] = useState(0);
  const [rightPos, setRightPos] = useState(TIMELINE_WIDTH);

  const leftRef = useRef(0);
  const rightRef = useRef(TIMELINE_WIDTH);

  const { currentTime, duration } = getPlaybackState();

  const playheadX =
    duration > 0 ? (currentTime / duration) * TIMELINE_WIDTH : 0;

  // ✅ AFTER hooks, conditional rendering is allowed
  if (activeTool !== 'trim') {
    return null;
  }

  const updateTrim = () => {
    setTrim(
      leftRef.current / TIMELINE_WIDTH,
      rightRef.current / TIMELINE_WIDTH
    );
  };

  const leftResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => startScrubbing(),
    onPanResponderMove: (_, g) => {
      const next = Math.max(
        0,
        Math.min(leftRef.current + g.dx, rightRef.current - HANDLE_WIDTH)
      );

      leftRef.current = next;
      setLeftPos(next);
      updateTrim();
    },
    onPanResponderRelease: () => stopScrubbing(),
  });

  const rightResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => startScrubbing(),
    onPanResponderMove: (_, g) => {
      const next = Math.min(
        TIMELINE_WIDTH,
        Math.max(rightRef.current + g.dx, leftRef.current + HANDLE_WIDTH)
      );

      rightRef.current = next;
      setRightPos(next);
      updateTrim();
    },
    onPanResponderRelease: () => stopScrubbing(),
  });

  const scrubResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      startScrubbing();
    },
    onPanResponderMove: (_, g) => {
      const x = Math.max(0, Math.min(g.moveX - PADDING, TIMELINE_WIDTH));
      const time = (x / TIMELINE_WIDTH) * duration;
      setCurrentTime(time);
    },
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderRelease: () => {
      stopScrubbing();
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.track} {...scrubResponder.panHandlers}>
        <View style={[styles.playhead, { left: playheadX - 1 }]} />
        <View
          style={[styles.active, { left: leftPos, width: rightPos - leftPos }]}
        />

        <View
          {...leftResponder.panHandlers}
          style={[styles.handle, { left: leftPos }]}
        />

        <View
          {...rightResponder.panHandlers}
          style={[styles.handle, { left: rightPos - HANDLE_WIDTH }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 100,
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
  },
  track: {
    height: 40,
    backgroundColor: '#222',
    borderRadius: 8,
    overflow: 'hidden',
  },
  active: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#00ff88',
    opacity: 0.25,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_WIDTH,
    height: '100%',
    backgroundColor: '#00ff88',
    zIndex: 10,
  },
  playhead: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 20,
  },
});
