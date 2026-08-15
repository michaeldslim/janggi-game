import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBoardLayout } from '../utils/coordinates';

const HORIZONTAL_MARGIN = 16;
const FOOTER_HEIGHT = 120;

export function useBoardLayout() {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const layout = useMemo(() => {
    const availableWidth = screenWidth - HORIZONTAL_MARGIN * 2;
    const availableHeight =
      screenHeight - insets.top - insets.bottom - FOOTER_HEIGHT;

    return createBoardLayout(availableWidth, availableHeight);
  }, [insets.bottom, insets.top, screenHeight, screenWidth]);

  return layout;
}
