import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { getOctagonPoints } from '../utils/octagon';

interface PieceOctagonProps {
  radius: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function PieceOctagon({
  radius,
  fill = 'transparent',
  stroke,
  strokeWidth = 0,
  style,
  children,
}: PieceOctagonProps) {
  const diameter = radius * 2;

  return (
    <View
      style={[
        styles.container,
        { width: diameter, height: diameter },
        style,
      ]}
    >
      <Svg width={diameter} height={diameter} style={StyleSheet.absoluteFill}>
        <Polygon
          points={getOctagonPoints(radius, radius, radius)}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      </Svg>
      {children}
    </View>
  );
}

interface PieceOctagonRingProps {
  radius: number;
  offset: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export function PieceOctagonRing({
  radius,
  offset,
  fill = 'none',
  stroke,
  strokeWidth = 0,
}: PieceOctagonRingProps) {
  const ringRadius = radius + offset;
  const ringSize = ringRadius * 2;

  return (
    <Svg
      width={ringSize}
      height={ringSize}
      style={{
        position: 'absolute',
        left: -offset,
        top: -offset,
      }}
    >
      <Polygon
        points={getOctagonPoints(ringRadius, ringRadius, ringRadius)}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
