// @ts-ignore - Peer dependency
import { ScaledSheet } from 'react-native-size-matters';
import { COLORS } from '../../constants/colors';

export const StyleFunction = () =>
  ScaledSheet.create({
    container: {
      backgroundColor: COLORS.BACKGROUND,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: 24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.BORDER,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.TEXT_PRIMARY,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeText: {
      fontSize: 20,
      color: COLORS.TEXT_PRIMARY,
      fontWeight: '600',
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 32,
      alignItems: 'center',
    },
    recordingInfo: {
      marginBottom: 24,
    },
    videoTimeText: {
      fontSize: 14,
      color: COLORS.TEXT_SECONDARY,
      textAlign: 'center',
    },
    recordButtonContainer: {
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    disabledRecordButton: {
      opacity: 0.5,
    },
    recordButtonOuter: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 4,
      borderColor: COLORS.TEXT_PRIMARY,
    },
    recordButtonOuterRecording: {
      borderColor: '#FF3040',
    },
    recordButtonInner: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: COLORS.TEXT_PRIMARY,
    },
    recordButtonInnerSquare: {
      borderRadius: 8,
      width: 30,
      height: 30,
    },
    timerContainer: {
      marginBottom: 16,
    },
    remainingTimeText: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.TEXT_PRIMARY,
    },
    statusContainer: {
      marginTop: 8,
      minHeight: 24,
    },
    statusText: {
      fontSize: 14,
      color: COLORS.TEXT_SECONDARY,
      textAlign: 'center',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: COLORS.BORDER,
    },
    footerButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    footerButtonText: {
      fontSize: 16,
      color: COLORS.TEXT_PRIMARY,
      fontWeight: '600',
    },
    footerTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: COLORS.TEXT_PRIMARY,
    },
    doneButtonText: {
      fontSize: 16,
      color: '#00ff88',
      fontWeight: '600',
    },
    disabledButton: {
      opacity: 0.5,
    },
  });
