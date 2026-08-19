import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBoardLayout } from '../utils/coordinates';

const HORIZONTAL_MARGIN = 16;
const FOOTER_HEIGHT = 120;
const CAPTURED_TRAY_HEIGHT = 44;
const COMPACT_PLAY_SCREEN_HEIGHT = 880;

export function useBoardLayout() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const { layout, isCompactPlayScreen } = useMemo(() => {
    const availableWidth = screenWidth - HORIZONTAL_MARGIN * 2;
    const availableHeight =
      screenHeight - insets.top - insets.bottom - FOOTER_HEIGHT - CAPTURED_TRAY_HEIGHT * 2;

    return {
      layout: createBoardLayout(availableWidth, availableHeight),
      isCompactPlayScreen: screenHeight < COMPACT_PLAY_SCREEN_HEIGHT,
    };
  }, [insets.bottom, insets.top, screenHeight, screenWidth]);

  return { layout, isCompactPlayScreen };
}
