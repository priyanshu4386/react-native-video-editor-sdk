import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  onCancel: () => void;
  onExport: () => void;
};

export const TopBar: React.FC<Props> = ({ onCancel, onExport }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCancel}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Video Editor</Text>

      <TouchableOpacity onPress={onExport}>
        <Text style={styles.export}>Export</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
    backgroundColor: '#000',
    zIndex: 100,
    elevation: 100,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancel: {
    color: '#fff',
    fontSize: 14,
  },
  export: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: '600',
  },
});
