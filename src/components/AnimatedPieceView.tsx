import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { getPieceHanja } from '../constants/pieces';
import { colors } from '../constants/colors';
import type { Piece } from '../types/janggi';
import type { BoardLayout } from '../utils/coordinates';
import { intersectionToPixel, positionsEqual } from '../utils/coordinates';
import { getPieceLabelStyle } from './pieceLabelStyle';

const FLIP_HALF_MS = 110;
const MOVE_SPRING_SPEED = 22;
const MOVE_SPRING_BOUNCE = 5;
const MOVE_FLIP_MS = 90;

interface AnimatedPieceViewProps {
  piece: Piece;
  layout: BoardLayout;
  selected?: boolean;
  lastMoved?: boolean;
}

function toPieceOrigin(file: number, rank: number, layout: BoardLayout) {
  const { x, y } = intersectionToPixel(file, rank, layout);
  const radius = layout.pieceRadius;

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
}: AnimatedPieceViewProps) {
  const radius = layout.pieceRadius;
  const diameter = radius * 2;
  const fontSize = radius * 1.15;
  const textColor = piece.side === 'cho' ? colors.choPieceText : colors.hanPieceText;

  const position = useRef(
    new Animated.ValueXY(toPieceOrigin(piece.position.file, piece.position.rank, layout)),
  ).current;
  const scaleX = useRef(new Animated.Value(1)).current;
  const [displayType, setDisplayType] = useState(piece.type);
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

    position.setValue(toPieceOrigin(piece.position.file, piece.position.rank, layout));
    previousLayoutKey.current = layoutKey;
  }, [layout, layoutKey, piece.position.file, piece.position.rank, position]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      previousPosition.current = piece.position;
      return;
    }

    if (positionsEqual(previousPosition.current, piece.position)) {
      return;
    }

    const target = toPieceOrigin(piece.position.file, piece.position.rank, layout);
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
      () => setDisplayType(piece.type),
      () => {
        previousType.current = piece.type;
      },
    );
  }, [piece.type, scaleX]);

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
        <View
          style={[
            styles.lastMovedRing,
            {
              width: diameter + 10,
              height: diameter + 10,
              borderRadius: radius + 5,
              left: -5,
              top: -5,
            },
          ]}
        />
      ) : null}
      {selected ? (
        <View
          style={[
            styles.selectedRing,
            {
              width: diameter + 8,
              height: diameter + 8,
              borderRadius: radius + 4,
              left: -4,
              top: -4,
            },
          ]}
        />
      ) : null}
      <View
        style={[
          styles.disc,
          {
            width: diameter,
            height: diameter,
            borderRadius: radius,
          },
        ]}
      >
        <Text style={getPieceLabelStyle(fontSize, textColor)}>
          {getPieceHanja({ side: piece.side, type: displayType })}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
  },
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pieceBackground,
    borderColor: colors.pieceBorder,
    borderWidth: 1.5,
  },
  selectedRing: {
    position: 'absolute',
    borderColor: '#FACC15',
    borderWidth: 2.5,
  },
  lastMovedRing: {
    position: 'absolute',
    borderColor: colors.lastMoveRing,
    borderWidth: 3,
  },
});
