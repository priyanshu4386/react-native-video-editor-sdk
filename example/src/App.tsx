import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  openVideoEditor,
  VideoEditorHost,
} from 'react-native-video-editor-sdk';
const source = require('./assets/videos/sample.mp4');

export default function App() {
  const onOpenEditor = async () => {
    try {
      console.log('Opening editor with source:', source);
      const result = await openVideoEditor({
        source: source,
        editTrim: true,
      });
      console.log('Editor result:', result);
    } catch (e) {
      console.error('Editor error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Main App Screen</Text>
      <Pressable style={styles.button} onPress={onOpenEditor}>
        <Text style={styles.buttonText}>Open Video Editor</Text>
      </Pressable>
      <VideoEditorHost />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#222',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
  },
});
