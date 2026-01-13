// src/types/index.ts

export type VideoEditorSDKProps = {
  source: string;

  editTrim?: boolean;
  editCrop?: boolean;
  editBGM?: boolean;
  editTextOverlay?: boolean;
  editSubtitle?: boolean;
  editVoiceOver?: boolean;
  editMutation?: boolean;

  onCloseEditor: (result: {
    success: boolean;
    exportedUri?: string;
    error?: string;
  }) => void;
};
