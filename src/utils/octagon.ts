/** Flat-top regular octagon vertex angles (radians), starting at top-right. */
const OCTAGON_VERTEX_ANGLES = Array.from({ length: 8 }, (_, index) => {
  return (2 * Math.PI * index) / 8 - Math.PI / 8;
});

/**
 * Returns SVG polygon points for a flat-top regular octagon.
 * @param cx - center x
 * @param cy - center y
 * @param radius - circumradius (center to vertex)
 */
export function getOctagonPoints(cx: number, cy: number, radius: number): string {
  return OCTAGON_VERTEX_ANGLES.map((angle) => {
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');
}
