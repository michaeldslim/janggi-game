import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import type { GameEndVariant } from '../game/gameEndMessage';
import { playGameEndHaptic } from '../utils/haptics';

interface GameEndMessageOverlayProps {
  visible: boolean;
  message: string;
  subtitle?: string | null;
  variant: GameEndVariant;
  width: number;
  height: number;
}

const VARIANT_STYLES: Record<
  GameEndVariant,
  { borderColor: string; titleColor: string; backdropOpacity: number }
> = {
  win: {
    borderColor: colors.gold,
    titleColor: colors.gold,
    backdropOpacity: 0.58,
  },
  loss: {
    borderColor: '#78716C',
    titleColor: '#FCA5A5',
    backdropOpacity: 0.62,
  },
  draw: {
    borderColor: '#60A5FA',
    titleColor: '#BFDBFE',
    backdropOpacity: 0.55,
  },
  neutral: {
    borderColor: colors.gold,
    titleColor: colors.textPrimary,
    backdropOpacity: 0.55,
  },
};

export function GameEndMessageOverlay({
  visible,
  message,
  subtitle,
  variant,
  width,
  height,
}: GameEndMessageOverlayProps) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const bannerScale = useRef(new Animated.Value(0.72)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const playedHapticRef = useRef(false);
  const variantStyle = VARIANT_STYLES[variant];

  useEffect(() => {
    if (!visible) {
      playedHapticRef.current = false;
      backdropOpacity.setValue(0);
      bannerScale.setValue(0.72);
      bannerOpacity.setValue(0);
      return;
    }

    if (!playedHapticRef.current) {
      playedHapticRef.current = true;
      playGameEndHaptic(variant);
    }

    const animation = Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: variantStyle.backdropOpacity,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(bannerScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 6,
      }),
      Animated.timing(bannerOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [
    backdropOpacity,
    bannerOpacity,
    bannerScale,
    variant,
    variantStyle.backdropOpacity,
    visible,
  ]);

  if (!visible) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={[styles.overlay, { width, height }]}
    >
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      <Animated.View
        style={[
          styles.banner,
          {
            borderColor: variantStyle.borderColor,
            opacity: bannerOpacity,
            transform: [{ scale: bannerScale }],
          },
        ]}
      >
        <Text style={[styles.title, { color: variantStyle.titleColor }]}>{message}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
  },
  banner: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderRadius: 18,
    borderWidth: 2,
    backgroundColor: 'rgba(26, 18, 8, 0.96)',
    maxWidth: '88%',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitle: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
});
