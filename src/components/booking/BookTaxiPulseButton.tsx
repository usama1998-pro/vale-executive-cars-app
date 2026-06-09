import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../theme';
import GoldenConfettiBurst from './GoldenConfettiBurst';

const BUTTON_GOLD = '#C89635';
const BUTTON_RING = '#8B6914';
const BUTTON_HIGHLIGHT = '#E8B84A';
const BUTTON_SHADOW = '#6B4F0F';

type BookTaxiPulseButtonProps = {
  size: number;
  onPress: () => void;
};

export default function BookTaxiPulseButton({
  size,
  onPress,
}: BookTaxiPulseButtonProps) {
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

      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Book a taxi ride"
        style={({ pressed }) => [
          styles.outerRing,
          {
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            opacity: pressed ? 0.92 : 1,
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
    zIndex: 2,
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
