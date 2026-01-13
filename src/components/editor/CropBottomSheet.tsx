import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEditorContext } from '../../context/EditorContext';
import { useEditorState } from '../../context/EditorStateContext';

const RATIOS = ['9:16', '1:1', '16:9'] as const;

export const CropBottomSheet = () => {
  const { activeTool } = useEditorContext();
  const { cropRatio, setCropRatio } = useEditorState();

  if (activeTool !== 'crop') return null;

  return (
    <View style={styles.sheet}>
      <Text style={styles.title}>Crop Ratio</Text>

      <View style={styles.row}>
        {RATIOS.map((ratio) => (
          <TouchableOpacity
            key={ratio}
            style={[styles.option, cropRatio === ratio && styles.active]}
            onPress={() => setCropRatio(ratio)}
          >
            <Text
              style={[styles.text, cropRatio === ratio && styles.activeText]}
            >
              {ratio}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheet: {
    minHeight: 120,
    backgroundColor: '#0a0a0a',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#222',
    minWidth: 80,
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#00ff88',
  },
  text: {
    color: '#aaa',
    fontWeight: '600',
    fontSize: 14,
  },
  activeText: {
    color: '#000',
  },
});
