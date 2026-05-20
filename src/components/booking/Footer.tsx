import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';

const FEATURES = [
  { icon: 'person-outline' as const, label: 'PROFESSIONAL EXECUTIVE DRIVERS' },
  { icon: 'car-sport-outline' as const, label: 'LUXURY & COMFORT GUARANTEED' },
  { icon: 'time-outline' as const, label: 'PUNCTUAL & RELIABLE SERVICE' },
  { icon: 'sync-outline' as const, label: 'AVAILABLE 24/7' },
];

type FooterProps = {
  scale: number;
  isWide: boolean;
  isTablet: boolean;
  compact?: boolean;
};

export default function Footer({ scale, isWide, isTablet, compact = false }: FooterProps) {
  const labelSize = Math.round((compact ? 7 : 9) * scale);
  const iconSize = compact ? 28 : 40;

  return (
    <View style={[styles.footer, isWide && styles.footerWide, compact && styles.footerCompact]}>
      {FEATURES.map((feature) => (
        <View
          key={feature.label}
          style={[
            styles.feature,
            !isWide && isTablet && styles.featureHalf,
            !isTablet && styles.featureFull,
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              { width: iconSize * scale, height: iconSize * scale },
            ]}
          >
            <Ionicons
              name={feature.icon}
              size={(compact ? 12 : 18) * scale}
              color={colors.gold}
            />
          </View>
          <Text style={[styles.featureLabel, { fontSize: labelSize }]}>{feature.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.goldMuted,
  },
  footerWide: {
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  footerCompact: {
    marginTop: 6,
    paddingTop: 6,
    gap: 4,
  },
  feature: {
    alignItems: 'center',
    maxWidth: 160,
    minWidth: 120,
    flex: 1,
  },
  featureHalf: {
    width: '45%',
    maxWidth: '45%',
  },
  featureFull: {
    width: '100%',
    maxWidth: '100%',
  },
  iconCircle: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureLabel: {
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
});
