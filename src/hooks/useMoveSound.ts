import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

const stoneSound = require('../../assets/sounds/stone.mp3');

export function useMoveSound() {
  const player = useAudioPlayer(stoneSound);

  const playMoveSound = useCallback(() => {
    void player.seekTo(0);
    player.play();
  }, [player]);

  return playMoveSound;
}
