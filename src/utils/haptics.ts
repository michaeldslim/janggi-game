import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type GameMessageHaptic = 'check' | 'meonggun';

export type GameEndHaptic = 'win' | 'loss' | 'draw' | 'neutral';

function canUseHaptics(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export function playGameMessageHaptic(type: GameMessageHaptic): void {
  if (!canUseHaptics()) {
    return;
  }

  if (type === 'check') {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    return;
  }

  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function playGameEndHaptic(variant: GameEndHaptic): void {
  if (!canUseHaptics()) {
    return;
  }

  if (variant === 'win') {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    return;
  }

  if (variant === 'loss') {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    return;
  }

  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
