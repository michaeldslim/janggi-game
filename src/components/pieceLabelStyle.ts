import { Platform, type TextStyle } from 'react-native';

export function getPieceLabelStyle(fontSize: number, color: string): TextStyle {
  const roundedSize = Math.round(fontSize);
  const lineHeight = Math.round(roundedSize * 1.12);

  return {
    color,
    fontSize: roundedSize,
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight,
    ...(Platform.OS === 'android'
      ? {
          textAlignVertical: 'center' as const,
          transform: [{ translateY: -roundedSize * 0.04 }],
        }
      : {}),
  };
}
