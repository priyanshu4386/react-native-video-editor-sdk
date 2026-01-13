import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';

import { EditorProvider } from '../context/EditorContext';
import {
  EditorStateProvider,
  useEditorState,
} from '../context/EditorStateContext';
import { VideoEditorNative } from '../native/VideoEditorNative';
import type { VideoEditorSDKProps } from '../types';
import { PreviewArea } from './editor/PreviewArea';
import { Timeline } from './editor/Timeline';
import { CropBottomSheet } from './editor/CropBottomSheet';
import { BottomToolBar } from './editor/BottomToolBar';
import { TopBar } from './editor/TopBar';

const VideoEditorSDKContent: React.FC<VideoEditorSDKProps> = ({
  source,
  editTrim = false,
  editCrop = true,
  editBGM = true,
  editTextOverlay = false,
  editSubtitle = false,
  editVoiceOver = false,
  editMutation = false,
  onCloseEditor,
}) => {
  const { initEditor, buildExportConfig, resetEditor } = useEditorState();

  useEffect(() => {
    if (!source) {
      onCloseEditor({ success: false, error: 'Video source missing' });
      return;
    }

    initEditor({
      source,
      features: {
        editTrim,
        editCrop,
        editBGM,
        editTextOverlay,
        editSubtitle,
        editVoiceOver,
        editMutation,
      },
    });

    return () => resetEditor();
  });

  const handleExport = useCallback(async () => {
    try {
      const config = buildExportConfig();
      const exportedUri = await VideoEditorNative.processVideoEditing(
        JSON.stringify(config)
      );
      onCloseEditor({ success: true, exportedUri });
    } catch (e: any) {
      onCloseEditor({
        success: false,
        error: e?.message ?? 'Export failed',
      });
    }
  }, [buildExportConfig, onCloseEditor]);

  return (
    <EditorProvider
      enabledFeatures={{
        editTrim,
        editCrop,
        editBGM,
        editTextOverlay,
        editSubtitle,
        editVoiceOver,
        editMutation,
      }}
    >
      <View style={styles.container}>
        <TopBar
          onCancel={() => onCloseEditor({ success: false })}
          onExport={handleExport}
        />
        <View style={styles.previewSection}>
          <PreviewArea source={source} />
        </View>
        <View style={styles.toolsSection}>
          <ScrollView
            style={styles.toolsScrollView}
            contentContainerStyle={styles.toolsContent}
            showsVerticalScrollIndicator={false}
          >
            <Timeline />
            <CropBottomSheet />
          </ScrollView>
          <BottomToolBar />
        </View>
      </View>
    </EditorProvider>
  );
};

export const VideoEditorSDK: React.FC<VideoEditorSDKProps> = (props) => {
  return (
    <EditorStateProvider>
      <VideoEditorSDKContent {...props} />
    </EditorStateProvider>
  );
};

const SCREEN_HEIGHT = Dimensions.get('window').height;
const TOP_BAR_HEIGHT = 52;
const AVAILABLE_HEIGHT = SCREEN_HEIGHT - TOP_BAR_HEIGHT;
const PREVIEW_HEIGHT = AVAILABLE_HEIGHT * 0.55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewSection: {
    height: PREVIEW_HEIGHT,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  toolsSection: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 2,
    borderTopColor: '#1c1c1e',
  },
  toolsScrollView: {
    flex: 1,
  },
  toolsContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
});
