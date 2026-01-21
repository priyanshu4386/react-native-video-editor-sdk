import { useState, useCallback, useRef } from 'react';
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
          videoDuration,
          (progressThumbs) => {
            setThumbnails(progressThumbs);
          }
        );

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
      } catch (error) {
        console.error('Error generating thumbnails:', error);
        hasGeneratedRef.current = false;
      } finally {
        setIsGenerating(false);
      }
    },
    [videoUri]
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
      setThumbnails([]);

      try {
        const results = await regenerateThumbnailsForTrim(
          videoUri,
          startTime,
          duration,
          (progressThumbs) => {
            setThumbnails(progressThumbs);
          }
        );

        setThumbnails(results);
      } catch (error) {
        console.error('Error regenerating thumbnails:', error);
      } finally {
        setIsGenerating(false);
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
