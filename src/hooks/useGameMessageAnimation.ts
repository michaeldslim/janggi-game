import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { playGameMessageHaptic, type GameMessageHaptic } from '../utils/haptics';

const SHOW_DURATION_MS = 1000;
const ENTER_MS = 280;
const EXIT_MS = 380;
const INITIAL_TRANSLATE_Y = -88;
const EXIT_TRANSLATE_Y = 112;

export function useGameMessageAnimation(
  triggerKey: number,
  haptic?: GameMessageHaptic,
) {
  const translateY = useRef(new Animated.Value(INITIAL_TRANSLATE_Y)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.55)).current;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (triggerKey === 0) {
      return;
    }

    if (haptic) {
      playGameMessageHaptic(haptic);
    }

    setVisible(true);
    translateY.setValue(INITIAL_TRANSLATE_Y);
    opacity.setValue(0);
    scale.setValue(0.55);

    const animation = Animated.sequence([
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 18,
          bounciness: 7,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ENTER_MS,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }),
      ]),
      Animated.delay(SHOW_DURATION_MS),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: EXIT_TRANSLATE_Y,
          duration: EXIT_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: EXIT_MS,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.85,
          duration: EXIT_MS,
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        setVisible(false);
      }
    });

    return () => {
      animation.stop();
    };
  }, [haptic, opacity, scale, translateY, triggerKey]);

  return {
    visible,
    opacity,
    scale,
    translateY,
  };
}
