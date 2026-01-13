import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEditorContext } from '../../context/EditorContext';
import type { EditorTool } from '../../context/EditorContext';

const TOOLS: EditorTool[] = ['trim', 'crop', 'text', 'subtitle', 'voiceover'];

export const BottomToolBar = () => {
  const { setActiveTool, enabledTools, activeTool } = useEditorContext();

  return (
    <View style={styles.container}>
      {TOOLS.map((tool) => {
        return (
          <TouchableOpacity
            key={tool}
            onPress={() => setActiveTool(activeTool === tool ? null : tool)}
          >
            {tool && enabledTools[tool] && (
              <Text style={[styles.tool, activeTool === tool && styles.active]}>
                {tool.toUpperCase()}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#1c1c1e',
  },
  tool: {
    color: '#aaa',
    fontSize: 12,
  },
  active: {
    color: '#00ff88',
    fontWeight: '600',
  },
});
