import { useState, useCallback, useRef, useEffect } from 'react';
import type { ThumbnailData } from '../types/timeline';
import {
  generateThumbnails,
  regenerateThumbnailsForTrim,
} from '../utils/thumbnailGenerator';

export const useThumbnails = (videoUri: string) => {
  const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const hasGeneratedRef = useRef(false);
  const lastValidThumbnailRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  const currentVideoUriRef = useRef<string>(videoUri);

  // Cleanup on unmount or video URI change
  useEffect(() => {
    isMountedRef.current = true;

    // If video URI changed, reset thumbnails to prevent memory accumulation
    if (currentVideoUriRef.current !== videoUri) {
      console.log('🧹 Video URI changed, clearing old thumbnails');
      setThumbnails([]);
      hasGeneratedRef.current = false;
      lastValidThumbnailRef.current = null;
      currentVideoUriRef.current = videoUri;
    }

    return () => {
      isMountedRef.current = false;
      // Clear thumbnails on unmount to free memory
      setThumbnails([]);
    };
  }, [videoUri]);

  const generate = useCallback(
    async (videoDuration: number) => {
      if (!videoUri || typeof videoUri !== 'string' || videoUri.trim() === '') {
        console.warn(
          '❌ Cannot generate thumbnails: missing or invalid videoUri',
          { videoUri, type: typeof videoUri }
        );
        return;
      }

      if (!videoDuration || videoDuration <= 0) {
        console.warn('❌ Cannot generate thumbnails: invalid duration', {
          videoDuration,
        });
        return;
      }

      if (isGenerating) {
        console.log('⏳ Thumbnail generation already in progress, skipping...');
        return;
      }

      if (hasGeneratedRef.current && thumbnails.length > 0) {
        console.log(
          `✅ Thumbnails already generated (${thumbnails.length} thumbnails), skipping...`
        );
        return;
      }

      console.log(
        `🚀 Starting thumbnail generation immediately for ${videoDuration.toFixed(
          2
        )}s video`
      );
      setIsGenerating(true);
      hasGeneratedRef.current = true;

      try {
        const results = await generateThumbnails(
          videoUri,
          videoDuration
          // Remove progress callback to avoid excessive state updates causing memory issues
        );

        // Only set thumbnails if component is still mounted
        if (isMountedRef.current) {
          setThumbnails(results);
          console.log(
            `✅ useThumbnails: Successfully generated and set ${results.length} thumbnails`,
            {
              total: results.length,
              successful: results.filter((t) => t.status === 'success').length,
              failed: results.filter((t) => t.status === 'failed').length,
              thumbnails: results.slice(0, 3).map((t, i) => ({
                index: i + 1,
                hasUri: !!t.uri,
                width: `${t.width.toFixed(2)}px`,
                status: t.status,
              })),
            }
          );
        }
      } catch (error) {
        console.error('Error generating thumbnails:', error);
        hasGeneratedRef.current = false;
      } finally {
        if (isMountedRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [videoUri, isGenerating, thumbnails.length]
  );

  const regenerateForTrim = useCallback(
    async (startTime: number, duration: number) => {
      if (!videoUri || typeof videoUri !== 'string' || videoUri.trim() === '') {
        console.warn(
          'Cannot regenerate thumbnails: missing or invalid videoUri'
        );
        return;
      }

      if (!duration || duration <= 0) {
        console.warn('Cannot regenerate thumbnails: invalid duration');
        return;
      }

      setIsGenerating(true);
      // Clear old thumbnails to free memory before regenerating
      setThumbnails([]);

      try {
        const results = await regenerateThumbnailsForTrim(
          videoUri,
          startTime,
          duration
          // Remove progress callback to avoid excessive state updates
        );

        // Only set if still mounted
        if (isMountedRef.current) {
          setThumbnails(results);
        }
      } catch (error) {
        console.error('Error regenerating thumbnails:', error);
      } finally {
        if (isMountedRef.current) {
          setIsGenerating(false);
        }
      }
    },
    [videoUri]
  );

  const reset = useCallback(() => {
    setThumbnails([]);
    hasGeneratedRef.current = false;
    lastValidThumbnailRef.current = null;
  }, []);

  return {
    thumbnails,
    isGenerating,
    generateThumbnails: generate,
    regenerateForTrim,
    resetThumbnails: reset,
  };
};
