import { Ionicons } from '@expo/vector-icons';
import { useCallback, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../theme';
import GoldenConfettiBurst from './GoldenConfettiBurst';

const useNativeDriver = Platform.OS !== 'web';

const BUTTON_GOLD = colors.buttonGold;
const BUTTON_RING = '#A87225';
const BUTTON_HIGHLIGHT = '#F2C96A';
const BUTTON_SHADOW = '#7A5A1A';

type BookTaxiPulseButtonProps = {
  size: number;
  onPress: () => void;
};

export default function BookTaxiPulseButton({
  size,
  onPress,
}: BookTaxiPulseButtonProps) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const tapRingScale = useRef(new Animated.Value(0)).current;
  const tapRingOpacity = useRef(new Animated.Value(0)).current;

  const handlePress = useCallback(() => {
    pressScale.setValue(1);
    tapRingScale.setValue(0.85);
    tapRingOpacity.setValue(0.7);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(pressScale, {
          toValue: 0.9,
          duration: 90,
          easing: Easing.out(Easing.quad),
          useNativeDriver,
        }),
        Animated.spring(pressScale, {
          toValue: 1,
          friction: 4,
          tension: 220,
          useNativeDriver,
        }),
      ]),
      Animated.sequence([
        Animated.timing(tapRingScale, {
          toValue: 1.45,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
        Animated.timing(tapRingOpacity, {
          toValue: 0,
          duration: 120,
          useNativeDriver,
        }),
      ]),
    ]).start();

    onPress();
  }, [onPress, pressScale, tapRingOpacity, tapRingScale]);

  const outerSize = size;
  const innerSize = size * 0.88;
  const iconSize = size * 0.22;
  const handSize = size * 0.16;
  const taxiLabelSize = Math.max(9, size * 0.07);
  const confettiSpread = Math.round(size * 1.05);
  const canvasSize = Math.round(size + confettiSpread * 1.9);
  const particleCount = Math.min(96, Math.max(56, Math.round(size * 0.24)));

  return (
    <View style={[styles.wrap, { width: canvasSize, height: canvasSize }]}>
      <GoldenConfettiBurst
        origin="circle"
        spread={confettiSpread}
        particleCount={particleCount}
        repeat
        repeatIntervalMs={2000}
        style={{
          left: canvasSize / 2,
          top: canvasSize / 2,
        }}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.tapRing,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            opacity: tapRingOpacity,
            transform: [{ scale: tapRingScale }],
          },
        ]}
      />

      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel="Book a taxi ride"
        hitSlop={8}
        style={styles.pressTarget}
      >
        <Animated.View
          style={[
            styles.outerRing,
            {
              width: outerSize,
              height: outerSize,
              borderRadius: outerSize / 2,
              transform: [{ scale: pressScale }],
            },
          ]}
        >
        <View
          style={[
            styles.innerCircle,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
            },
          ]}
        >
          <View style={styles.carBlock}>
            <Ionicons name="car-sport" size={iconSize} color={colors.background} />
            <View style={[styles.taxiBadge, { paddingHorizontal: size * 0.03 }]}>
              <Text style={[styles.taxiLabel, { fontSize: taxiLabelSize }]}>
                TAXI
              </Text>
            </View>
          </View>

          <View style={styles.touchBlock}>
            <View style={styles.touchRipples}>
              <View
                style={[
                  styles.touchRipple,
                  {
                    width: size * 0.1,
                    height: size * 0.1,
                    borderRadius: size * 0.05,
                  },
                ]}
              />
              <View
                style={[
                  styles.touchRipple,
                  styles.touchRippleMid,
                  {
                    width: size * 0.14,
                    height: size * 0.14,
                    borderRadius: size * 0.07,
                  },
                ]}
              />
              <View
                style={[
                  styles.touchRipple,
                  styles.touchRippleOuter,
                  {
                    width: size * 0.18,
                    height: size * 0.18,
                    borderRadius: size * 0.09,
                  },
                ]}
              />
            </View>
            <Ionicons
              name="hand-left"
              size={handSize}
              color={colors.background}
              style={styles.handIcon}
            />
          </View>
        </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  pressTarget: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  tapRing: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: BUTTON_HIGHLIGHT,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  outerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BUTTON_RING,
    borderWidth: 4,
    borderColor: BUTTON_SHADOW,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BUTTON_GOLD,
    borderWidth: 2,
    borderColor: BUTTON_HIGHLIGHT,
    gap: 4,
  },
  carBlock: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  taxiBadge: {
    marginTop: -2,
    backgroundColor: colors.background,
    borderRadius: 3,
    paddingVertical: 1,
  },
  taxiLabel: {
    color: BUTTON_GOLD,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  touchBlock: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  touchRipples: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 18,
    marginBottom: -4,
  },
  touchRipple: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: colors.background,
    backgroundColor: 'transparent',
  },
  touchRippleMid: {
    opacity: 0.75,
  },
  touchRippleOuter: {
    opacity: 0.45,
  },
  handIcon: {
    transform: [{ rotate: '-15deg' }],
  },
});
