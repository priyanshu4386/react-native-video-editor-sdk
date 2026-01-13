import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type VideoElement = {
  type: string;

  uri?: string;
  muted?: boolean;

  startTime?: number;
  endTime?: number;

  selection_params?: string;

  musicUri?: string;
  audioOffset?: number;
  isLooped?: boolean;

  text?: string;
  fontSize?: number;
  textColor?: string;
  textOverlayColor?: string;
  textPosition?: {
    xAxis: number;
    yAxis: number;
  };
  screenWidth?: number;
  screenHeight?: number;

  subtitleJson?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  subtitleSize?: number;
  subtitlePosition?: string;
  subtitleOverlayColor?: string;
  subtitleColor?: string;

  voiceOverUri?: string;
};

type InitParams = {
  source: string;
  features: Record<string, boolean>;
};

type CropRatio = '9:16' | '1:1' | '16:9';

type EditorStateContextValue = {
  initEditor: (params: InitParams) => void;
  upsertOperation: (element: VideoElement) => void;
  removeOperation: (type: string) => void;
  buildExportConfig: () => { videoElements: VideoElement[] };
  resetEditor: () => void;
  setTrim: (start: number, end: number) => void;
  getTrim: () => { start: number; end: number };
  cropRatio: CropRatio;
  setCropRatio: (ratio: CropRatio) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  getPlaybackState: () => { currentTime: number; duration: number };
  isScrubbing: boolean;
  startScrubbing: () => void;
  stopScrubbing: () => void;
};

const EditorStateContext = createContext<EditorStateContextValue | null>(null);

type EditorStateProviderProps = {
  children: React.ReactNode;
};

export const EditorStateProvider: React.FC<EditorStateProviderProps> = ({
  children,
}) => {
  const videoElementsRef = useRef<VideoElement[]>([]);
  const sourceRef = useRef<string | null>(null);

  const [cropRatio, setCropRatio] = useState<CropRatio>('9:16');
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [currentTime, setCurrentTimeState] = useState(0);
  const [duration, setDurationState] = useState(0);
  const startScrubbing = () => setIsScrubbing(true);
  const stopScrubbing = () => setIsScrubbing(false);

  useEffect(() => {
    upsertOperation({
      type: 'crop',
      selection_params: cropRatio,
    });
  }, [cropRatio]);

  // Initialize editor
  const initEditor = ({ source, features }: InitParams) => {
    sourceRef.current = source;

    videoElementsRef.current = [
      {
        type: 'videoUri',
        uri: source,
        muted: features.editMutation ?? false,
      },
    ];
  };

  const trimRef = useRef<{ start: number; end: number }>({
    start: 0,
    end: 1,
  });

  const setTrim = (start: number, end: number) => {
    trimRef.current = { start, end };

    upsertOperation({
      type: 'trim',
      startTime: start,
      endTime: end,
    });
  };

  const getTrim = () => trimRef.current;

  const setCurrentTime = (time: number) => {
    setCurrentTimeState(time);
  };

  const setDuration = (durationValue: number) => {
    setDurationState(durationValue);
  };

  const getPlaybackState = () => ({
    currentTime,
    duration,
  });

  // const getMaskFromRatio = (ratio: CropRatio) => {
  //   switch (ratio) {
  //     case '9:16':
  //       return null;
  //     case '1:1':
  //       return { top: 0.125, bottom: 0.125, left: 0, right: 0 };
  //     case '16:9':
  //       return { top: 0.35, bottom: 0.35, left: 0, right: 0 };
  //   }
  // };

  // Add or replace operation
  const upsertOperation = (element: VideoElement) => {
    const index = videoElementsRef.current.findIndex(
      (e) => e.type === element.type
    );

    if (index >= 0) {
      videoElementsRef.current[index] = element;
    } else {
      videoElementsRef.current.push(element);
    }
  };

  // Remove operation
  const removeOperation = (type: string) => {
    videoElementsRef.current = videoElementsRef.current.filter(
      (e) => e.type !== type
    );
  };

  // Build native export JSON
  const buildExportConfig = () => {
    return {
      videoElements: videoElementsRef.current,
    };
  };
  console.log(JSON.stringify(buildExportConfig(), null, 2));
  // Reset editor
  const resetEditor = () => {
    videoElementsRef.current = [];
    sourceRef.current = null;
    setCurrentTimeState(0);
    setDurationState(0);
  };

  return (
    <EditorStateContext.Provider
      value={{
        initEditor,
        upsertOperation,
        removeOperation,
        buildExportConfig,
        resetEditor,
        setTrim,
        getTrim,
        cropRatio,
        setCropRatio,
        setCurrentTime,
        setDuration,
        getPlaybackState,
        isScrubbing,
        startScrubbing,
        stopScrubbing,
      }}
    >
      {children}
    </EditorStateContext.Provider>
  );
};

export const useEditorState = () => {
  const ctx = useContext(EditorStateContext);
  if (!ctx) {
    throw new Error('useEditorState must be used inside EditorStateProvider');
  }
  return ctx;
};
