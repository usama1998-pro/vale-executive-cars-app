import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import GoldButton from './GoldButton';

const WHATSAPP_URL = 'https://wa.me/447708044445';
const WEBSITE_URL = 'https://www.valeexecutive.com';
const QR_IMAGE =
  'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' +
  encodeURIComponent(WHATSAPP_URL);

type LeftPanelProps = {
  scale: number;
  isWide: boolean;
  compact?: boolean;
};

export default function LeftPanel({ scale, isWide, compact = false }: LeftPanelProps) {
  const sectionTitle = Math.round(13 * scale);
  const bodySize = Math.round(12 * scale);
  const smallSize = Math.round(10 * scale);

  const blockGap = compact ? spacing.sm : spacing.md;
  const sectionGap = compact ? spacing.sm : spacing.lg;
  const qrSize = compact ? 56 * scale : 100 * scale;

  return (
    <View style={[styles.panel, compact && styles.panelCompact]}>
      <View style={[styles.section, { marginBottom: blockGap }]}>
        <Ionicons name="airplane" size={(compact ? 16 : 22) * scale} color={colors.gold} />
        <Text style={[styles.sectionTitle, { fontSize: sectionTitle }]}>
          AIRPORT TRANSFERS
        </Text>
        <Text style={[styles.body, { fontSize: bodySize }]}>
          For all airport transfer bookings, please visit:
        </Text>
        <GoldButton
          label="www.valeexecutive.com"
          icon="open-outline"
          variant="outline"
          scale={scale}
          style={styles.linkButton}
          onPress={() => Linking.openURL(WEBSITE_URL)}
        />
      </View>

      <View style={[styles.noticeBox, compact && styles.noticeBoxCompact, { marginBottom: sectionGap }]}>
        <Ionicons name="alert-circle-outline" size={20 * scale} color={colors.gold} />
        <Text style={[styles.noticeText, { fontSize: smallSize }]}>
          IF YOU WOULD LIKE TO PRE-BOOK AN EXECUTIVE TAXI, PLEASE COMPLETE THE
          BOOKING FORM. FOR LAST-MINUTE BOOKINGS OR URGENT TRAVEL REQUESTS,
          PLEASE CALL OR WHATSAPP US DIRECTLY.
        </Text>
      </View>

      <Text
        style={[
          styles.contactHeading,
          { fontSize: sectionTitle, marginBottom: blockGap },
        ]}
      >
        CONTACT INFORMATION
      </Text>

      <View
        style={[
          styles.contactRow,
          !isWide && styles.contactRowStacked,
          { marginBottom: sectionGap },
        ]}
      >
        <ContactItem
          icon="call-outline"
          label="PHONE"
          value="01367 333333"
          scale={scale}
          compact={compact}
          onPress={() => Linking.openURL('tel:01367333333')}
        />
        <ContactItem
          icon="logo-whatsapp"
          label="WHATSAPP"
          value="07708 044445"
          scale={scale}
          compact={compact}
          onPress={() => Linking.openURL(WHATSAPP_URL)}
        />
      </View>

      <View
        style={[
          styles.qrSection,
          compact && styles.qrSectionCompact,
          !isWide && styles.qrSectionStacked,
          { marginBottom: compact ? 0 : sectionGap },
        ]}
      >
        <View style={styles.qrTextBlock}>
          <Ionicons
            name="logo-whatsapp"
            size={(compact ? 24 : 36) * scale}
            color={colors.gold}
          />
          <Text style={[styles.sectionTitle, { fontSize: sectionTitle, marginTop: 4 }]}>
            WHATSAPP US
          </Text>
          <Text style={[styles.qrSubtitle, { fontSize: sectionTitle }]}>SCAN QR CODE</Text>
          {!compact ? (
            <Text style={[styles.body, { fontSize: smallSize, marginTop: 4 }]}>
              Open WhatsApp camera and scan to chat with us instantly!
            </Text>
          ) : null}
        </View>
        <Image
          source={{ uri: QR_IMAGE }}
          style={[styles.qrImage, { width: qrSize, height: qrSize }]}
          resizeMode="contain"
        />
      </View>

      {!compact ? (
      <View style={styles.partnership}>
        <Text style={[styles.partnershipLabel, { fontSize: smallSize }]}>
          IN PARTNERSHIP WITH
        </Text>
        <Text style={[styles.partnershipName, { fontSize: Math.round(18 * scale) }]}>
          COTSWOLDS FINEST PUBS
        </Text>
        <MaterialCommunityIcons
          name="home-variant"
          size={64 * scale}
          color={colors.textMuted}
          style={styles.pubIcon}
        />
      </View>
      ) : null}
    </View>
  );
}

function ContactItem({
  icon,
  label,
  value,
  scale,
  compact,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  scale: number;
  compact?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.contactCard, compact && styles.contactCardCompact]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20 * scale} color={colors.gold} />
      <Text style={[styles.contactLabel, { fontSize: 10 * scale }]}>{label}</Text>
      <Text style={[styles.contactValue, { fontSize: 13 * scale }]}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    minWidth: 280,
  },
  panelCompact: {
    minWidth: 0,
    justifyContent: 'space-between',
  },
  section: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 8,
    textAlign: 'center',
  },
  body: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  linkButton: {
    marginTop: 12,
    alignSelf: 'stretch',
  },
  noticeBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    padding: spacing.md,
    gap: 12,
  },
  noticeBoxCompact: {
    padding: spacing.sm,
    gap: 8,
  },
  noticeText: {
    flex: 1,
    color: colors.text,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  contactHeading: {
    color: colors.gold,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contactRowStacked: {
    flexDirection: 'column',
  },
  contactCard: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 6,
  },
  contactCardCompact: {
    paddingVertical: 8,
  },
  qrSectionCompact: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
  contactLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  contactValue: {
    color: colors.text,
    fontWeight: '600',
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    padding: spacing.md,
    gap: spacing.md,
  },
  qrSectionStacked: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrTextBlock: {
    flex: 1,
  },
  qrSubtitle: {
    color: colors.goldLight,
    fontWeight: '700',
    letterSpacing: 1,
  },
  qrImage: {
    backgroundColor: '#fff',
    borderRadius: radius.sm,
  },
  partnership: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  partnershipLabel: {
    color: colors.textMuted,
    letterSpacing: 1,
  },
  partnershipName: {
    color: colors.goldLight,
    fontFamily: 'serif',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  pubIcon: {
    marginTop: spacing.md,
    opacity: 0.7,
  },
});
