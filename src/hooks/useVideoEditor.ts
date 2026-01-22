import { useState, useCallback, useRef } from 'react';
// @ts-ignore
import Video from 'react-native-video';
import type {
  AudioSegment,
  VoiceoverSegment,
  AspectRatioType,
  VideoNaturalSize,
} from '../types';
import { useThumbnails } from './useThumbnails';
import { useTrimming } from './useTrimming';
import { useAudioSync } from './useAudioSync';
import { useTextEditor } from './useTextEditor';

export const useVideoEditor = (videoUri: string) => {
  // Video playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [originalDuration, setOriginalDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [mainVideoVolume, setMainVideoVolume] = useState(1.0);
  const [bgMusicVolume, setBgMusicVolume] = useState(1.0);
  const [videoNaturalSize, setVideoNaturalSize] =
    useState<VideoNaturalSize | null>(null);

  // Timeline state
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const videoRef = useRef<any>(null);
  const timelineScrollRef = useRef<any>(null);
  const wasPlayingBeforeDragRef = useRef(false);

  // Segments
  const [audioSegments, setAudioSegments] = useState<AudioSegment[]>([]);
  const [hasAudioSegments, setHasAudioSegments] = useState(false);
  const [voiceoverSegments, setVoiceoverSegments] = useState<
    VoiceoverSegment[]
  >([]);
  const [hasVoiceovers, setHasVoiceovers] = useState(false);

  // Aspect ratio
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<AspectRatioType>('original');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // Custom hooks
  const thumbnails = useThumbnails(videoUri);
  const trimming = useTrimming();
  const audioSync = useAudioSync();
  const textEditor = useTextEditor();

  /**
   * Initialize video data on load
   */
  const onVideoLoad = useCallback(
    (data: any) => {
      if (originalDuration === 0) {
        setOriginalDuration(data.duration);
        setVideoNaturalSize(data.naturalSize);
        trimming.initializeTrimHandles(data.duration);

        // Generate thumbnails
        thumbnails.generateThumbnails(data.duration);
      }
      setVideoDuration(data.duration);
    },
    [originalDuration, trimming, thumbnails]
  );

  const onVideoProgress = useCallback(
    (data: any) => {
      const absoluteTime = data.currentTime;
      const relativeTime = Math.max(
        0,
        absoluteTime - trimming.trimOffsetRef.current
      );

      const isVoiceoverActive = voiceoverSegments.some(
        (seg) => relativeTime >= seg.start && relativeTime < seg.end
      );
      const isBgMusicActive = audioSegments.some(
        (seg) => relativeTime >= seg.start && relativeTime < seg.end
      );

      // Volume ducking
      setBgMusicVolume(isVoiceoverActive ? 0.4 : 1.0);

      if (isMuted) {
        setMainVideoVolume(0.0);
      } else if (isVoiceoverActive) {
        setMainVideoVolume(0.15);
      } else if (isBgMusicActive) {
        setMainVideoVolume(0.46);
      } else {
        setMainVideoVolume(1.0);
      }

      // Loop video if reached end
      if (relativeTime >= videoDuration) {
        videoRef.current?.seek(trimming.trimOffsetRef.current);
        audioSync.syncBgMusic(0, audioSegments[0]);
        if (!trimming.isDraggingHandle) {
          setCurrentTime(0);
        }
        return;
      }

      if (!isUserScrolling && !trimming.isDraggingHandle) {
        setCurrentTime(relativeTime);
      }
    },
    [
      trimming.trimOffsetRef,
      trimming.isDraggingHandle,
      voiceoverSegments,
      audioSegments,
      isMuted,
      videoDuration,
      isUserScrolling,
      audioSync,
    ]
  );

  /**
   * Seek video to specific time
   */
  const seekVideo = useCallback(
    (relativeTime: number) => {
      const absoluteTime = trimming.trimOffsetRef.current + relativeTime;
      videoRef.current?.seek(absoluteTime);
      setCurrentTime(relativeTime);

      // Sync audio
      if (audioSegments[0]) {
        audioSync.syncBgMusic(relativeTime, audioSegments[0]);
      }
      audioSync.syncVoiceovers(relativeTime, voiceoverSegments);
    },
    [trimming.trimOffsetRef, audioSegments, voiceoverSegments, audioSync]
  );

  /**
   * Add audio segment
   */
  const addAudioSegment = useCallback((segment: AudioSegment) => {
    setAudioSegments([segment]);
    setHasAudioSegments(true);
  }, []);

  /**
   * Delete audio segment
   */
  const deleteAudioSegment = useCallback((segmentId: string) => {
    setAudioSegments((prev) => {
      const newSegments = prev.filter((seg) => seg.id !== segmentId);
      if (newSegments.length === 0) {
        setHasAudioSegments(false);
      }
      return newSegments;
    });
  }, []);

  /**
   * Add voiceover segment
   */
  const addVoiceoverSegment = useCallback((segment: VoiceoverSegment) => {
    setVoiceoverSegments((prev) => [...prev, segment]);
    setHasVoiceovers(true);
  }, []);

  /**
   * Delete voiceover segment
   */
  const deleteVoiceoverSegment = useCallback((segmentId: string) => {
    setVoiceoverSegments((prev) => {
      const newSegments = prev.filter((seg) => seg.id !== segmentId);
      if (newSegments.length === 0) {
        setHasVoiceovers(false);
      }
      return newSegments;
    });
  }, []);

  return {
    // Video state
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    videoDuration,
    setVideoDuration,
    originalDuration,
    isMuted,
    setIsMuted,
    mainVideoVolume,
    bgMusicVolume,
    videoNaturalSize,

    // Timeline state
    isTimelineVisible,
    setIsTimelineVisible,
    isUserScrolling,
    setIsUserScrolling,

    // Refs
    videoRef,
    timelineScrollRef,
    wasPlayingBeforeDragRef,

    // Segments
    audioSegments,
    hasAudioSegments,
    addAudioSegment,
    deleteAudioSegment,
    voiceoverSegments,
    hasVoiceovers,
    addVoiceoverSegment,
    deleteVoiceoverSegment,

    // Aspect ratio
    selectedAspectRatio,
    setSelectedAspectRatio,

    // Processing
    isProcessing,
    setIsProcessing,

    // Custom hooks
    thumbnails,
    trimming,
    audioSync,
    textEditor,

    // Actions
    onVideoLoad,
    onVideoProgress,
    seekVideo,
  };
};
