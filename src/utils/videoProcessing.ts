import type {
  ExportVideoElement,
  ExportConfig,
  AudioSegment,
  TextSegment,
  VoiceoverSegment,
  AspectRatioType,
} from '../types';
import { deviceUtils } from './deviceUtils';
import { isVisionCameraVideo } from './timelineUtils';
import { PREVIEW_WIDTH, PREVIEW_HEIGHT } from '../constants/dimensions';

export const buildExportConfiguration = (
  videoUri: string,
  videoDuration: number,
  trimOffset: number,
  isMuted: boolean,
  selectedAspectRatio: AspectRatioType,
  audioSegments: AudioSegment[],
  textSegments: TextSegment[],
  voiceoverSegments: VoiceoverSegment[]
): ExportConfig => {
  const videoElements: ExportVideoElement[] = [];

  // 1. Source Video with mute flag
  videoElements.push({
    type: 'videoUri',
    uri: videoUri,
    muted: isMuted,
  });

  // 2. Crop: Apply if specific aspect ratio selected
  if (selectedAspectRatio !== 'original') {
    videoElements.push({
      type: 'crop',
      selection_params: selectedAspectRatio,
    });
  }

  // 3. Trim: Core operation defining final clip's start and end
  videoElements.push({
    type: 'trim',
    startTime: trimOffset,
    endTime: trimOffset + videoDuration,
  });

  // 4. Add Background Music
  audioSegments.forEach((segment) => {
    videoElements.push({
      type: 'addBGM',
      musicUri: segment.uri,
      startTime: segment.start,
      endTime: segment.end,
      audioOffset: segment.audioOffset,
      isLooped: segment.isLooped,
    });
  });

  // 5. Add Text Overlays
  textSegments.forEach((segment) => {
    // Calculate text dimensions (approximate)
    const estimatedTextWidth = segment.text.length * segment.fontSize * 0.6;
    const estimatedTextHeight = segment.fontSize * 1.4;

    // Convert from top-left corner to center point
    const centerX = (segment?.x || 0) + estimatedTextWidth / 2;
    const centerY = (segment?.y || 0) + estimatedTextHeight / 2;

    // Normalize coordinates
    const normalizedX = (centerX / PREVIEW_WIDTH) * 2 - 1; // -1 to +1
    const normalizedY = 1 - (centerY / PREVIEW_HEIGHT) * 2; // +1 to -1 (flip Y)

    const xAxis = deviceUtils.isAndroid ? normalizedX : segment.x || 0;
    const yAxis = deviceUtils.isAndroid ? normalizedY : segment.y || 0;

    videoElements.push({
      type: 'addTextOverlay',
      text: segment.text,
      fontSize: deviceUtils.isAndroid
        ? deviceUtils.dpToPixels(segment.fontSize)
        : segment.fontSize,
      textColor: segment.color,
      textOverlayColor: segment.backgroundColor,
      textPosition: {
        xAxis,
        yAxis,
      },
      startTime: segment.start,
      endTime: segment.end,
      screenWidth: PREVIEW_WIDTH,
      screenHeight: PREVIEW_HEIGHT,
    });
  });

  // 6. Add Voiceovers
  voiceoverSegments.forEach((segment) => {
    videoElements.push({
      type: 'addVoiceOver',
      voiceOverUri: segment.uri,
      startTime: segment.start,
      endTime: segment.end,
    });
  });

  return {
    videoElements,
    isVisionCameraVideo: isVisionCameraVideo(videoUri),
  };
};

/**
 * Convert DP to pixels for Android
 */
export const dpTOPixels = (dp: number): number => {
  return deviceUtils.dpToPixels(dp);
};

/**
 * Placeholder for saving video to gallery
 * TODO: Implement with native module
 */
export const handleSaveVideo = async (videoUri: string): Promise<void> => {
  console.log('Saving video to gallery:', videoUri);
  // TODO: Implement native save functionality
  // For now, just log
};
