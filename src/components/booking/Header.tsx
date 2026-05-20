import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme';

type HeaderProps = {
  scale: number;
  isWide: boolean;
  compact?: boolean;
};

export default function Header({ scale, isWide, compact = false }: HeaderProps) {
  const titleSize = Math.round((compact ? 22 : isWide ? 32 : 26) * scale);
  const taglineSize = Math.round((compact ? 9 : 11) * scale);
  const logoSize = Math.round((compact ? 28 : 48) * scale);

  return (
    <View style={[styles.header, compact && styles.headerCompact]}>
      <Pressable style={[styles.langButton, { paddingVertical: 6 * scale, paddingHorizontal: 12 * scale }]}>
        <Ionicons name="globe-outline" size={14 * scale} color={colors.gold} />
        <Text style={[styles.langText, { fontSize: 11 * scale }]}>ENGLISH</Text>
        <Ionicons name="chevron-down" size={12 * scale} color={colors.gold} />
      </Pressable>

      <View style={styles.brandBlock}>
        <MaterialCommunityIcons
          name="horse-variant"
          size={logoSize}
          color={colors.gold}
        />
        <Text style={[styles.title, { fontSize: titleSize }]}>Vale Executive Cars</Text>
        <View style={styles.taglineRow}>
          <View style={styles.taglineLine} />
          <Text style={[styles.tagline, { fontSize: taglineSize }]}>WE GO THE EXTRA MILE</Text>
          <View style={styles.taglineLine} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  headerCompact: {
    marginBottom: 6,
  },
  langButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    zIndex: 1,
  },
  langText: {
    color: colors.gold,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  brandBlock: {
    alignItems: 'center',
    paddingTop: 8,
  },
  title: {
    color: colors.goldLight,
    fontFamily: 'serif',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 16,
  },
  taglineLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.goldMuted,
  },
  tagline: {
    color: colors.gold,
    letterSpacing: 1.5,
    fontWeight: '500',
  },
});
