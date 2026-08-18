import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { colors } from '../constants/colors';
import { useGameMessageAnimation } from '../hooks/useGameMessageAnimation';
import { GAME_MESSAGE_BADGE_SIZE, getGameMessageBadgePoints } from '../utils/bumpyCircle';

const BUMPY_CIRCLE_POINTS = getGameMessageBadgePoints();

interface MeonggunMessageOverlayProps {
  message: string;
  triggerKey: number;
  boardWidth: number;
  boardHeight: number;
}

export function MeonggunMessageOverlay({
  message,
  triggerKey,
  boardWidth,
  boardHeight,
}: MeonggunMessageOverlayProps) {
  const { visible, opacity, scale, translateY } = useGameMessageAnimation(triggerKey, 'meonggun');

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: (boardWidth - GAME_MESSAGE_BADGE_SIZE) / 2,
          top: (boardHeight - GAME_MESSAGE_BADGE_SIZE) / 2,
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    >
      <Svg width={GAME_MESSAGE_BADGE_SIZE} height={GAME_MESSAGE_BADGE_SIZE} style={styles.shape}>
        <Polygon
          points={BUMPY_CIRCLE_POINTS}
          fill={colors.meonggunFill}
          stroke={colors.meonggunStroke}
          strokeWidth={3.5}
        />
      </Svg>
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_MESSAGE_BADGE_SIZE,
    height: GAME_MESSAGE_BADGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  shape: {
    position: 'absolute',
  },
  labelWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  label: {
    color: '#EFF6FF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(30, 58, 138, 0.55)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
