import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

const STEPS: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { icon: 'location-outline', label: 'Pinpointing your addresses' },
  { icon: 'navigate-outline', label: 'Mapping the fastest route' },
  { icon: 'cash-outline', label: 'Calculating your fare' },
];

const STEP_INTERVAL_MS = 1100;

type EstimateLoaderProps = {
  scale?: number;
};

export default function EstimateLoader({ scale = 1 }: EstimateLoaderProps) {
  const [activeStep, setActiveStep] = useState(0);
  const pulse = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    pulseLoop.start();
    spinLoop.start();
    return () => {
      pulseLoop.stop();
      spinLoop.stop();
    };
  }, [pulse, spin]);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, STEP_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.35],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, 0],
  });
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const badgeSize = Math.round(96 * scale);

  return (
    <View style={styles.card}>
      <View style={[styles.badgeWrap, { width: badgeSize, height: badgeSize }]}>
        <Animated.View
          style={[
            styles.pulseRing,
            { borderRadius: badgeSize / 2, opacity: ringOpacity, transform: [{ scale: ringScale }] },
          ]}
        />
        <Animated.View
          style={[
            styles.spinnerRing,
            { borderRadius: badgeSize / 2, transform: [{ rotate }] },
          ]}
        />
        <View style={[styles.badgeCore, { borderRadius: badgeSize / 2 }]}>
          <Ionicons name="car-sport" size={Math.round(36 * scale)} color={colors.gold} />
        </View>
      </View>

      <Text style={styles.title}>Building your estimate</Text>
      <Text style={styles.subtitle}>
        Hang tight — we&apos;re working out the distance and price for your journey.
      </Text>

      <View style={styles.steps}>
        {STEPS.map((step, index) => {
          const isActive = index === activeStep;
          const isDone = index < activeStep;
          return (
            <View
              key={step.label}
              style={[styles.stepRow, isActive && styles.stepRowActive]}
            >
              <View style={[styles.stepIcon, isActive && styles.stepIconActive]}>
                <Ionicons
                  name={isDone ? 'checkmark' : step.icon}
                  size={16}
                  color={isActive ? colors.buttonText : colors.gold}
                />
              </View>
              <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>
                {step.label}
              </Text>
              {isActive ? (
                <View style={styles.stepDots}>
                  <Dot delay={0} />
                  <Dot delay={160} />
                  <Dot delay={320} />
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function Dot({ delay }: { delay: number }) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(value, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, delay]);

  const opacity = value.interpolate({ inputRange: [0, 1], outputRange: [0.25, 1] });
  const translateY = value.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  return <Animated.View style={[styles.dot, { opacity, transform: [{ translateY }] }]} />;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundPanel,
  },
  badgeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  pulseRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: colors.gold,
  },
  spinnerRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: colors.gold,
    borderRightColor: colors.gold,
  },
  badgeCore: {
    width: '78%',
    height: '78%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.goldLight,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
    marginTop: 6,
    marginBottom: spacing.lg,
    opacity: 0.85,
  },
  steps: {
    width: '100%',
    gap: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  stepRowActive: {
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  stepIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepIconActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  stepLabel: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
    opacity: 0.7,
  },
  stepLabelActive: {
    color: colors.goldLight,
    fontWeight: '700',
    opacity: 1,
  },
  stepDots: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.gold,
  },
});
