import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type GameMessageHaptic = 'check' | 'meonggun';

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
