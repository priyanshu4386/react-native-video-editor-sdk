import { View, StyleSheet } from 'react-native';
import { useEditorContext } from '../../context/EditorContext';
import { useEditorState } from '../../context/EditorStateContext';
import { getMaskByRatio } from '../../utils/helperUtils';

export const CropMaskOverlay = () => {
  const { activeTool } = useEditorContext();
  const { cropRatio } = useEditorState();

  if (activeTool !== 'crop') return null;

  const toOffsets = (mask: { width: number; height: number }) => {
    return {
      top: (1 - mask.height) / 2,
      bottom: (1 - mask.height) / 2,
      left: (1 - mask.width) / 2,
      right: (1 - mask.width) / 2,
    };
  };

  const mask = getMaskByRatio(cropRatio);
  if (!mask) return null;

  const offsets = toOffsets(mask);

  return (
    <>
      <View
        style={[
          styles.mask,
          styles.topOffeset,
          {
            height: `${offsets.top * 100}%`,
          },
        ]}
      />
      <View
        style={[
          styles.mask,
          styles.bottomOffeset,
          {
            height: `${offsets.bottom * 100}%`,
          },
        ]}
      />
      {/* Left mask */}
      <View
        style={[
          styles.mask,
          styles.leftOffeset,
          {
            top: `${offsets.left * 100}%`,
            bottom: `${offsets.bottom * 100}%`,
            width: `${offsets.left * 100}%`,
          },
        ]}
      />
      {/* Right mask */}
      <View
        style={[
          styles.mask,
          styles.rightOffeset,
          {
            top: `${offsets.right * 100}%`,
            bottom: `${offsets.bottom * 100}%`,
            width: `${offsets.right * 100}%`,
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  rightOffeset: {
    right: 0,
  },
  leftOffeset: {
    left: 0,
  },
  topOffeset: {
    top: 0,
    left: 0,
    right: 0,
  },
  bottomOffeset: {
    bottom: 0,
    left: 0,
    right: 0,
  },
});
