import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { getPieceGlyphSize, getPieceRadius } from '../constants/pieceSize';
import { colors } from '../constants/colors';
import type { Piece, PieceType } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { intersectionToPixel, positionsEqual } from '../utils/coordinates';
import { PieceGlyph } from './PieceGlyph';
import { PieceOctagon, PieceOctagonRing } from './PieceOctagon';

const FLIP_HALF_MS = 110;
const MOVE_SPRING_SPEED = 22;
const MOVE_SPRING_BOUNCE = 5;
const MOVE_FLIP_MS = 90;

interface AnimatedPieceViewProps {
  piece: Piece;
  layout: BoardLayout;
  selected?: boolean;
  lastMoved?: boolean;
  inCheck?: boolean;
  isCaptureTarget?: boolean;
}

function toPieceOrigin(
  file: number,
  rank: number,
  layout: BoardLayout,
  type: PieceType,
) {
  const { x, y } = intersectionToPixel(file, rank, layout);
  const radius = getPieceRadius(layout.pieceRadius, type);

  return {
    x: x - radius,
    y: y - radius,
  };
}

function runFlip(
  scaleX: Animated.Value,
  onMidpoint: () => void,
  onComplete?: () => void,
) {
  Animated.timing(scaleX, {
    toValue: 0,
    duration: FLIP_HALF_MS,
    useNativeDriver: true,
  }).start(({ finished }) => {
    if (!finished) {
      return;
    }

    onMidpoint();

    Animated.timing(scaleX, {
      toValue: 1,
      duration: FLIP_HALF_MS,
      useNativeDriver: true,
    }).start(({ finished: flipFinished }) => {
      if (flipFinished) {
        onComplete?.();
      }
    });
  });
}

export function AnimatedPieceView({
  piece,
  layout,
  selected = false,
  lastMoved = false,
  inCheck = false,
  isCaptureTarget = false,
}: AnimatedPieceViewProps) {
  const [displayType, setDisplayType] = useState(piece.type);
  const radius = getPieceRadius(layout.pieceRadius, displayType);
  const diameter = radius * 2;
  const glyphSize = getPieceGlyphSize(radius, displayType);
  const textColor = piece.side === 'cho' ? colors.choPieceText : colors.hanPieceText;

  const position = useRef(
    new Animated.ValueXY(
      toPieceOrigin(piece.position.file, piece.position.rank, layout, piece.type),
    ),
  ).current;
  const scaleX = useRef(new Animated.Value(1)).current;
  const [elevated, setElevated] = useState(false);
  const previousPosition = useRef(piece.position);
  const previousType = useRef(piece.type);
  const hasMounted = useRef(false);
  const layoutKey = `${layout.width}-${layout.height}`;
  const previousLayoutKey = useRef(layoutKey);

  useEffect(() => {
    if (previousLayoutKey.current === layoutKey) {
      return;
    }

    position.setValue(
      toPieceOrigin(piece.position.file, piece.position.rank, layout, displayType),
    );
    previousLayoutKey.current = layoutKey;
  }, [displayType, layout, layoutKey, piece.position.file, piece.position.rank, position]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      previousPosition.current = piece.position;
      return;
    }

    if (positionsEqual(previousPosition.current, piece.position)) {
      return;
    }

    const target = toPieceOrigin(
      piece.position.file,
      piece.position.rank,
      layout,
      piece.type,
    );
    setElevated(true);

    Animated.parallel([
      Animated.spring(position, {
        toValue: target,
        useNativeDriver: true,
        speed: MOVE_SPRING_SPEED,
        bounciness: MOVE_SPRING_BOUNCE,
      }),
      Animated.sequence([
        Animated.timing(scaleX, {
          toValue: 0.2,
          duration: MOVE_FLIP_MS,
          useNativeDriver: true,
        }),
        Animated.timing(scaleX, {
          toValue: 1,
          duration: MOVE_FLIP_MS,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setElevated(false);
    });

    previousPosition.current = piece.position;
  }, [layout, piece.position, position, scaleX]);

  useEffect(() => {
    if (previousType.current === piece.type) {
      return;
    }

    runFlip(
      scaleX,
      () => {
        setDisplayType(piece.type);
        position.setValue(
          toPieceOrigin(piece.position.file, piece.position.rank, layout, piece.type),
        );
      },
      () => {
        previousType.current = piece.type;
      },
    );
  }, [layout, piece.position.file, piece.position.rank, piece.type, position, scaleX]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.piece,
        {
          width: diameter,
          height: diameter,
          zIndex: elevated ? 3 : 1,
          transform: [...position.getTranslateTransform(), { scaleX }],
        },
      ]}
    >
      {lastMoved ? (
        <PieceOctagonRing
          radius={radius}
          offset={5}
          stroke={colors.lastMoveRing}
          strokeWidth={3}
        />
      ) : null}
      {selected ? (
        <PieceOctagonRing
          radius={radius}
          offset={4}
          stroke="#FACC15"
          strokeWidth={2.5}
        />
      ) : null}
      {inCheck ? (
        <PieceOctagonRing
          radius={radius}
          offset={5}
          stroke={colors.checkRing}
          strokeWidth={3}
        />
      ) : null}
      {isCaptureTarget ? (
        <PieceOctagonRing
          radius={radius}
          offset={7}
          fill={colors.captureTargetGlow}
        />
      ) : null}
      {isCaptureTarget ? (
        <PieceOctagonRing
          radius={radius}
          offset={5}
          stroke={colors.captureTargetRing}
          strokeWidth={3.5}
        />
      ) : null}
      <PieceOctagon
        radius={radius}
        fill={colors.pieceBackground}
        stroke={colors.pieceBorder}
        strokeWidth={1.5}
      >
        <PieceGlyph
          side={piece.side}
          type={displayType}
          size={glyphSize}
          color={textColor}
        />
      </PieceOctagon>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
  },
});
