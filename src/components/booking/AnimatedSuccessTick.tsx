import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../../theme';

type AnimatedSuccessTickProps = {
  size?: number;
  ringColor?: string;
  checkColor?: string;
};

export default function AnimatedSuccessTick({
  size = 80,
  ringColor = colors.yellow,
  checkColor = colors.background,
}: AnimatedSuccessTickProps) {
  const ringScale = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const ringIn = Animated.parallel([
      Animated.spring(ringScale, {
        toValue: 1,
        friction: 5,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(ringOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const checkIn = Animated.parallel([
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(checkOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.sequence([ringIn, checkIn]).start(({ finished }) => {
      if (finished) {
        pulse.start();
      }
    });

    return () => {
      pulse.stop();
    };
  }, [checkOpacity, checkScale, pulseScale, ringOpacity, ringScale]);

  const iconSize = Math.round(size * 0.48);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: ringColor,
            opacity: ringOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.35],
            }),
            transform: [{ scale: pulseScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: ringColor,
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
          },
        ]}
      >
        <Animated.View
          style={{
            opacity: checkOpacity,
            transform: [{ scale: checkScale }],
          }}
        >
          <Ionicons name="checkmark" size={iconSize} color={checkColor} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
