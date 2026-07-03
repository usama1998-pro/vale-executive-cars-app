import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

type JourneyRouteDisplayProps = {
  from: string;
  to: string;
  compact?: boolean;
  scale?: number;
};

type RouteStopProps = {
  label: string;
  address: string;
  icon: keyof typeof Ionicons.glyphMap;
  compact: boolean;
  scale: number;
  alignEnd?: boolean;
};

function RouteStop({
  label,
  address,
  icon,
  compact,
  scale,
  alignEnd = false,
}: RouteStopProps) {
  const fontSize = Math.round((compact ? 17 : 18) * scale);
  const cityIconSize = Math.round((compact ? 22 : 24) * scale);

  return (
    <View style={[styles.stop, compact && styles.stopCompact, alignEnd && styles.stopPickupCompact]}>
      <View style={[styles.stopHeader, alignEnd && styles.stopHeaderEnd]}>
        <Ionicons name={icon} size={cityIconSize} color={colors.gold} />
        <Text style={[styles.label, { fontSize: Math.round(11 * scale) }]}>{label}</Text>
      </View>
      <Text
        style={[
          styles.address,
          styles.addressSingleLine,
          { fontSize },
          alignEnd && styles.addressRight,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {address}
      </Text>
    </View>
  );
}

export default function JourneyRouteDisplay({
  from,
  to,
  compact = false,
  scale = 1,
}: JourneyRouteDisplayProps) {
  const layoutCompact = compact;
  const progress = useRef(new Animated.Value(0)).current;
  const arrive = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        // small "arrival" pulse at the destination
        Animated.timing(arrive, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.delay(450),
        Animated.parallel([
          Animated.timing(progress, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.timing(arrive, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, arrive]);

  const carSize = Math.round((compact ? 22 : 24) * scale);
  const carBox = Math.round(carSize * 1.6);

  // Length the car travels along the track.
  const trackThickness = layoutCompact ? 120 : 64;
  const travel = trackThickness - carBox;

  const carShift = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travel],
  });

  // gentle bob along the way
  const carBob = progress.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [0, -3, 0, -3, 0],
  });

  // trail fill that follows the car
  const trailSize = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const destPulse = arrive.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.45],
  });
  const destOpacity = arrive.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const carTransform = layoutCompact
    ? [{ translateX: carShift }, { translateY: carBob }]
    : [{ translateY: carShift }, { translateX: carBob }];

  return (
    <View style={[styles.card, layoutCompact && styles.cardCompact]}>
      <RouteStop
        label="PICKUP"
        address={from}
        icon="business"
        compact={layoutCompact}
        scale={scale}
        alignEnd={layoutCompact}
      />

      <View
        style={[
          styles.track,
          layoutCompact ? styles.trackHorizontal : styles.trackVertical,
          { [layoutCompact ? 'width' : 'height']: trackThickness },
        ]}
      >
        <View style={[styles.trackLine, layoutCompact ? styles.baseLineHorizontal : styles.baseLineVertical]} />
        <Animated.View
          style={[
            styles.trailLine,
            layoutCompact ? styles.trailLineHorizontal : styles.trailLineVertical,
            layoutCompact ? { width: trailSize } : { height: trailSize },
          ]}
        />

        {/* destination arrival pulse */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.destPulse,
            layoutCompact ? styles.destPulseHorizontal : styles.destPulseVertical,
            {
              opacity: destOpacity,
              transform: [{ scale: destPulse }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.carWrap,
            {
              width: carBox,
              height: carBox,
              borderRadius: carBox / 2,
              transform: carTransform,
            },
            layoutCompact
              ? [styles.carWrapHorizontal, { marginTop: -carBox / 2 }]
              : [styles.carWrapVertical, { marginLeft: -carBox / 2 }],
          ]}
        >
          <Ionicons
            name="car-sport"
            size={carSize}
            color={colors.buttonText}
            style={!layoutCompact ? styles.carVerticalIcon : undefined}
          />
        </Animated.View>
      </View>

      <RouteStop
        label="DROP-OFF"
        address={to}
        icon="location"
        compact={layoutCompact}
        scale={scale}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  cardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 920,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  stop: {
    borderRadius: radius.sm,
    backgroundColor: colors.inputBg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  stopCompact: {
    flex: 1,
    minWidth: 0,
    maxWidth: '42%',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  stopPickupCompact: {
    alignItems: 'flex-end',
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopHeaderEnd: {
    justifyContent: 'flex-end',
  },
  addressRight: {
    textAlign: 'right',
  },
  label: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 0.8,
    opacity: 0.9,
  },
  address: {
    color: colors.text,
    fontWeight: '600',
    lineHeight: 22,
  },
  addressSingleLine: {
    width: '100%',
  },
  track: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackHorizontal: {
    alignSelf: 'center',
    height: 44,
  },
  trackVertical: {
    width: 44,
    alignSelf: 'center',
    marginVertical: 2,
  },
  trackLine: {
    position: 'absolute',
    backgroundColor: colors.border,
    opacity: 0.4,
  },
  trailLine: {
    position: 'absolute',
    backgroundColor: colors.gold,
    opacity: 0.85,
  },
  baseLineHorizontal: {
    left: 0,
    right: 0,
    height: 3,
    top: '50%',
    marginTop: -1.5,
  },
  baseLineVertical: {
    top: 0,
    bottom: 0,
    width: 3,
    left: '50%',
    marginLeft: -1.5,
  },
  trailLineHorizontal: {
    left: 0,
    height: 3,
    top: '50%',
    marginTop: -1.5,
  },
  trailLineVertical: {
    top: 0,
    width: 3,
    left: '50%',
    marginLeft: -1.5,
  },
  destPulse: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.gold,
  },
  destPulseHorizontal: {
    right: 0,
    top: '50%',
    marginTop: -11,
  },
  destPulseVertical: {
    bottom: 0,
    left: '50%',
    marginLeft: -11,
  },
  carWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
    borderWidth: 2,
    borderColor: colors.background,
  },
  carWrapHorizontal: {
    left: 0,
    top: '50%',
  },
  carWrapVertical: {
    top: 0,
    left: '50%',
  },
  carVerticalIcon: {
    transform: [{ rotate: '90deg' }],
  },
});
