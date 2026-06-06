import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme';

const useNativeDriver = Platform.OS !== 'web';

const GOLD_CONFETTI = ['#C89635', '#E8C76A', '#A67B2A', '#F0D78C', '#D4A843', colors.gold];

type BurstOrigin = 'center' | 'bottomLeft' | 'bottomRight';

type Particle = {
  id: number;
  endX: number;
  endY: number;
  size: number;
  endRotation: number;
  color: string;
  delay: number;
  shape: 'rect' | 'circle' | 'strip';
  width: number;
  height: number;
};

function buildParticles(count: number, spread: number, origin: BurstOrigin): Particle[] {
  return Array.from({ length: count }, (_, id) => {
    const shapeRoll = Math.random();
    const shape: Particle['shape'] =
      shapeRoll > 0.66 ? 'strip' : shapeRoll > 0.33 ? 'rect' : 'circle';
    const size = 4 + Math.random() * 5;

    let endX = 0;
    let endY = 0;

    if (origin === 'bottomLeft') {
      const reach = 0.7 + Math.random() * 1.25;
      endX = reach * spread * (0.45 + Math.random() * 0.55);
      endY = -reach * spread * (0.55 + Math.random() * 0.65);
    } else if (origin === 'bottomRight') {
      const reach = 0.7 + Math.random() * 1.25;
      endX = -reach * spread * (0.45 + Math.random() * 0.55);
      endY = -reach * spread * (0.55 + Math.random() * 0.65);
    } else {
      const angle = (Math.PI * 2 * id) / count + (Math.random() - 0.5) * 0.9;
      const distance = spread * (0.55 + Math.random() * 0.65);
      endX = Math.cos(angle) * distance;
      endY = Math.sin(angle) * distance - spread * 0.2;
    }

    return {
      id,
      endX,
      endY,
      size,
      endRotation: 180 + Math.random() * 540,
      color: GOLD_CONFETTI[id % GOLD_CONFETTI.length],
      delay: Math.random() * 160,
      shape,
      width: shape === 'strip' ? size * 0.45 : size,
      height: shape === 'strip' ? size * 1.8 : size,
    };
  });
}

function ConfettiParticle({
  particle,
  spread,
}: {
  particle: Particle;
  spread: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 950 + spread * 2.4 + particle.delay,
      delay: particle.delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver,
    });
    animation.start();
    return () => animation.stop();
  }, [particle, progress, spread]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, particle.endX],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, particle.endY * 0.55, particle.endY - spread * 0.04],
  });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${particle.endRotation}deg`],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.1, 0.88, 1],
    outputRange: [0, 1, 1, 0],
  });
  const scale = progress.interpolate({
    inputRange: [0, 0.15, 1],
    outputRange: [0.2, 1, 0.85],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          width: particle.width,
          height: particle.height,
          borderRadius: particle.shape === 'circle' ? particle.size : 2,
          backgroundColor: particle.color,
          opacity,
          transform: [{ translateX }, { translateY }, { rotate }, { scale }],
        },
      ]}
    />
  );
}

type GoldenConfettiBurstProps = {
  spread?: number;
  particleCount?: number;
  repeat?: boolean;
  origin?: BurstOrigin;
  style?: ViewStyle;
};

export default function GoldenConfettiBurst({
  spread = 120,
  particleCount = 28,
  repeat = true,
  origin = 'center',
  style,
}: GoldenConfettiBurstProps) {
  const [burstId, setBurstId] = useState(0);
  const popScale = useRef(new Animated.Value(0)).current;
  const popOpacity = useRef(new Animated.Value(0)).current;
  const particles = useMemo(
    () => buildParticles(particleCount, spread, origin),
    [burstId, origin, particleCount, spread],
  );

  useEffect(() => {
    if (!repeat) {
      return undefined;
    }
    const interval = setInterval(() => setBurstId((id) => id + 1), 3200);
    return () => clearInterval(interval);
  }, [repeat]);

  useEffect(() => {
    popScale.setValue(0);
    popOpacity.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(popOpacity, {
          toValue: 0.55,
          duration: 120,
          useNativeDriver,
        }),
        Animated.timing(popOpacity, {
          toValue: 0,
          duration: 380,
          useNativeDriver,
        }),
      ]),
      Animated.sequence([
        Animated.spring(popScale, {
          toValue: 1,
          friction: 5,
          tension: 140,
          useNativeDriver,
        }),
        Animated.timing(popScale, {
          toValue: 1.35,
          duration: 420,
          easing: Easing.out(Easing.quad),
          useNativeDriver,
        }),
      ]),
    ]).start();
  }, [burstId, popOpacity, popScale]);

  const originStyle =
    origin === 'bottomLeft'
      ? styles.originBottomLeft
      : origin === 'bottomRight'
        ? styles.originBottomRight
        : styles.originCenter;

  const popSize = spread * 0.5;
  const popCoreSize = spread * 0.18;
  const popOffset =
    origin === 'bottomLeft'
      ? { left: -popSize / 2, top: -popSize / 2 }
      : origin === 'bottomRight'
        ? { right: -popSize / 2, top: -popSize / 2 }
        : { left: -popSize / 2, top: -popSize / 2 };
  const popCoreOffset =
    origin === 'bottomLeft'
      ? { left: -popCoreSize / 2, top: -popCoreSize / 2 }
      : origin === 'bottomRight'
        ? { right: -popCoreSize / 2, top: -popCoreSize / 2 }
        : { left: -popCoreSize / 2, top: -popCoreSize / 2 };

  return (
    <View pointerEvents="none" style={[originStyle, style]}>
      <Animated.View
        style={[
          styles.popRing,
          popOffset,
          {
            width: popSize,
            height: popSize,
            borderRadius: popSize / 2,
            opacity: popOpacity,
            transform: [{ scale: popScale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.popCore,
          popCoreOffset,
          {
            width: popCoreSize,
            height: popCoreSize,
            borderRadius: popCoreSize / 2,
            opacity: popOpacity,
            transform: [{ scale: popScale }],
          },
        ]}
      />
      {particles.map((particle) => (
        <ConfettiParticle key={`${burstId}-${particle.id}`} particle={particle} spread={spread} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  originCenter: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  originBottomLeft: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  originBottomRight: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  popRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: 'transparent',
  },
  popCore: {
    position: 'absolute',
    backgroundColor: colors.gold,
  },
  particle: {
    position: 'absolute',
  },
});
