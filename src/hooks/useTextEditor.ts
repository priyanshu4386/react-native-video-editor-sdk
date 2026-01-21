import { useState, useCallback } from 'react';
import type { TextSegment } from '../types/segments';
import { FONT_SIZE_DEFAULT } from '../constants/dimensions';
import { TEXT_COLORS } from '../constants/colors';

export const useTextEditor = () => {
  const [textSegments, setTextSegments] = useState<TextSegment[]>([]);
  const [hasTextSegments, setHasTextSegments] = useState(false);
  const [isTextEditorVisible, setIsTextEditorVisible] = useState(false);
  const [editingTextElement, setEditingTextElement] =
    useState<TextSegment | null>(null);
  const [newSegmentTiming, setNewSegmentTiming] = useState<{
    start: number;
    end: number;
  } | null>(null);

  /**
   * Add or update text segment
   */
  const saveTextSegment = useCallback(
    (textData: Partial<TextSegment>, videoDuration: number) => {
      if (textData.id) {
        // Update existing
        setTextSegments((prev) =>
          prev.map((seg) =>
            seg.id === textData.id
              ? ({ ...seg, ...textData } as TextSegment)
              : seg
          )
        );
      } else {
        // Add new
        const newSegment: TextSegment = {
          id: `text-${Date.now()}`,
          type: 'text',
          text: textData.text || '',
          fontSize: textData.fontSize || FONT_SIZE_DEFAULT,
          color: textData.color || TEXT_COLORS[0]!,
          backgroundColor: textData.backgroundColor || 'transparent',
          x: textData?.x,
          y: textData?.y,
          start: newSegmentTiming?.start || 0,
          end: newSegmentTiming?.end || videoDuration,
          alignment: textData.alignment,
        };
        setTextSegments((prev) => [...prev, newSegment]);
        setHasTextSegments(true);
      }
    },
    [newSegmentTiming]
  );

  /**
   * Delete text segment
   */
  const deleteTextSegment = useCallback((segmentId: string) => {
    setTextSegments((prev) => {
      const newSegments = prev.filter((seg) => seg.id !== segmentId);
      if (newSegments.length === 0) {
        setHasTextSegments(false);
      }
      return newSegments;
    });
  }, []);

  /**
   * Update text segment position
   */
  const updateTextPosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setTextSegments((prev) =>
        prev.map((seg) =>
          seg.id === id ? { ...seg, x: position.x, y: position.y } : seg
        )
      );
    },
    []
  );

  /**
   * Update text segment font size
   */
  const updateTextFontSize = useCallback((id: string, newSize: number) => {
    setTextSegments((prev) =>
      prev.map((seg) => (seg.id === id ? { ...seg, fontSize: newSize } : seg))
    );
  }, []);

  /**
   * Update text segment timing (start/end)
   */
  const updateTextTiming = useCallback(
    (id: string, timing: { start?: number; end?: number }) => {
      setTextSegments((prev) =>
        prev.map((seg) => (seg.id === id ? { ...seg, ...timing } : seg))
      );
    },
    []
  );

  return {
    // State
    textSegments,
    hasTextSegments,
    isTextEditorVisible,
    editingTextElement,
    newSegmentTiming,

    // Setters
    setTextSegments,
    setIsTextEditorVisible,
    setEditingTextElement,
    setNewSegmentTiming,

    // Actions
    saveTextSegment,
    deleteTextSegment,
    updateTextPosition,
    updateTextFontSize,
    updateTextTiming,
  };
};
