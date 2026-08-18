export const GAME_MESSAGE_BADGE_SIZE = 192;

export function getGameMessageBadgePoints(): string {
  const center = GAME_MESSAGE_BADGE_SIZE / 2;
  return getBumpyCirclePoints(center, center - 6);
}

export function getBumpyCirclePoints(
  center: number,
  baseRadius: number,
  segments = 24,
  wobble = 0.09,
): string {
  const coords: string[] = [];

  for (let index = 0; index < segments; index += 1) {
    const angle = (2 * Math.PI * index) / segments - Math.PI / 2;
    const radius = baseRadius * (1 + (index % 2 === 0 ? wobble : -wobble * 0.55));
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    coords.push(`${x},${y}`);
  }

  return coords.join(' ');
}
