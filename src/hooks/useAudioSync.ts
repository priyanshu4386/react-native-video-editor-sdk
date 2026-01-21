import { useCallback, useRef } from 'react';
import type { AudioSegment, VoiceoverSegment } from '../types/segments';

export const useAudioSync = () => {
  const bgMusicPlayerRef = useRef<any>(null);
  const voiceoverRefs = useRef<Record<string, any>>({});

  /**
   * Sync background music with video playback time
   */
  const syncBgMusic = useCallback(
    (timeInSeconds: number, audioSegment?: AudioSegment) => {
      if (!bgMusicPlayerRef.current || !audioSegment) {
        return;
      }

      const audioDuration = audioSegment.clipDuration;
      let audioPlaybackTime: number;

      if (audioSegment.isLooped) {
        // Handle looped audio with modulo
        if (audioDuration > 0) {
          audioPlaybackTime =
            (timeInSeconds - audioSegment.start) % audioDuration;
        } else {
          audioPlaybackTime = 0;
        }
      } else {
        // Non-looped audio
        audioPlaybackTime = timeInSeconds - audioSegment.start;
      }

      const seekTime = audioSegment.audioOffset + audioPlaybackTime;
      bgMusicPlayerRef.current.seek(seekTime);
    },
    []
  );

  /**
   * Sync all voiceovers with video playback time
   */
  const syncVoiceovers = useCallback(
    (timeInSeconds: number, voiceoverSegments: VoiceoverSegment[]) => {
      voiceoverSegments.forEach((segment) => {
        const isCurrentlyPlaying =
          timeInSeconds >= segment.start && timeInSeconds < segment.end;
        const voiceoverRef = voiceoverRefs.current[segment.id];

        if (voiceoverRef?.current) {
          if (isCurrentlyPlaying) {
            const playbackTime = timeInSeconds - segment.start;
            voiceoverRef.current.seek(playbackTime);
          } else {
            voiceoverRef.current.seek(0);
          }
        }
      });
    },
    []
  );

  /**
   * Get or create voiceover ref
   */
  const getVoiceoverRef = useCallback((segmentId: string) => {
    if (!voiceoverRefs.current[segmentId]) {
      voiceoverRefs.current[segmentId] = { current: null };
    }
    return voiceoverRefs.current[segmentId];
  }, []);

  return {
    bgMusicPlayerRef,
    voiceoverRefs,
    syncBgMusic,
    syncVoiceovers,
    getVoiceoverRef,
  };
};
