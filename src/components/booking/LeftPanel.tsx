import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';
import GoldButton from './GoldButton';

const LOGO = require('../../../assets/vale-executive-brand-logo.png');
const WHATSAPP_URL = 'https://wa.me/447708044445';
const QR_IMAGE =
  'https://api.qrserver.com/v1/create-qr-code/?size=512x512&margin=2&ecc=M&data=' +
  encodeURIComponent(WHATSAPP_URL);

type LeftPanelProps = {
  scale: number;
  isWide: boolean;
  compact?: boolean;
  dense?: boolean;
  fill?: boolean;
  isWeb?: boolean;
  webFit?: boolean;
};

export default function LeftPanel({
  scale,
  isWide,
  compact = false,
  dense = false,
  fill = false,
  isWeb = false,
  webFit = false,
}: LeftPanelProps) {
  const tight = compact || dense || webFit;
  const headingSize = Math.round(
    (dense ? 17 : compact ? 19 : isWeb ? 25 : isWide ? 26 : 23) * scale,
  );
  const noticeSize = Math.round(
    (dense ? 11 : isWide ? 16 : isWeb ? 14 : 13) * scale,
  );
  const airportIconSize = Math.round(
    (dense ? 22 : isWide ? 40 : tight ? 28 : 32) * scale,
  );
  const airportTitleSize = Math.round(
    (dense ? 13 : isWide ? 20 : tight ? 15 : 17) * scale,
  );
  const airportBodySize = Math.round(
    (dense ? 11 : isWide ? 16 : tight ? 13 : 15) * scale,
  );

  const blockGap = tight ? spacing.sm : spacing.md;
  const sectionGap = tight ? spacing.sm : spacing.lg;
  const logoHeight = dense
    ? 72 * scale
    : isWide
      ? 260 * scale
      : compact
        ? 120 * scale
        : 200 * scale;
  const qrSize = dense
    ? 80 * scale
    : tight
      ? 96 * scale
      : isWide
        ? 140 * scale
        : 120 * scale;

  const content = (
    <>
      <View style={[styles.logoSection, { marginBottom: blockGap }]}>
        <View style={styles.logoWrap}>
          <Image
            source={LOGO}
            style={[
              styles.logo,
              { height: logoHeight, maxWidth: isWide ? '100%' : 440 },
            ]}
            resizeMode="contain"
            accessibilityLabel="Vale Executives Cars logo"
          />
        </View>
        <Text style={[styles.formHeading, { fontSize: headingSize }]}>
          BOOK YOUR EXECUTIVE TAXI
        </Text>
      </View>

      <View
        style={[
          styles.noticeBox,
          tight && styles.noticeBoxCompact,
          { marginBottom: sectionGap },
        ]}
      >
        <Ionicons
          name="alert-circle-outline"
          size={Math.round(22 * scale)}
          color={colors.gold}
        />
        <Text
          style={[
            styles.noticeText,
            isWide && styles.noticeTextWide,
            { fontSize: noticeSize, lineHeight: noticeSize * 1.45 },
          ]}
        >
          IF YOU WOULD LIKE TO PRE-BOOK AN EXECUTIVE TAXI, PLEASE COMPLETE THE
          BOOKING FORM. FOR LAST-MINUTE BOOKINGS OR URGENT TRAVEL REQUESTS,
          PLEASE CALL OR WHATSAPP US DIRECTLY.
        </Text>
      </View>

      <View
        style={[
          styles.sectionBox,
          tight && styles.sectionBoxCompact,
          { marginBottom: sectionGap },
        ]}
      >
        <Ionicons
          name="airplane"
          size={airportIconSize}
          color={colors.gold}
        />
        <Text style={[styles.sectionTitle, { fontSize: airportTitleSize }]}>
          AIRPORT TRANSFERS
        </Text>
        <Text style={[styles.body, { fontSize: airportBodySize, lineHeight: airportBodySize * 1.4 }]}>
          For all airport transfer bookings, please visit:
        </Text>
        <View pointerEvents="none" style={styles.linkButton}>
          <GoldButton
            label="www.valeexecutive.com"
            variant="outline"
            scale={scale}
          />
        </View>
      </View>

      <View
        style={[
          styles.contactBlock,
          tight && styles.contactBlockCompact,
        ]}
      >
        <ContactItem
          icon="call-outline"
          label="PHONE"
          value="01367 333333"
          scale={scale}
          compact={tight}
          isWide={isWide}
          onPress={() => Linking.openURL('tel:01367333333')}
        />
        <ContactItem
          icon="logo-whatsapp"
          label="WHATSAPP"
          value="07708 044445"
          scale={scale}
          compact={tight}
          isWide={isWide}
          iconColor={colors.whatsapp}
          onPress={() => Linking.openURL(WHATSAPP_URL)}
        />
        <View style={[styles.qrSection, tight && styles.qrSectionCompact]}>
          <Image
            source={{ uri: QR_IMAGE }}
            style={[styles.qrImage, { width: qrSize, height: qrSize }]}
            resizeMode="cover"
          />
        </View>
      </View>
    </>
  );

  if (fill) {
    return (
      <View style={[styles.panel, styles.panelFill]}>
        <ScrollView
          style={styles.panelScroll}
          contentContainerStyle={styles.panelScrollContent}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {content}
        </ScrollView>
      </View>
    );
  }

  return <View style={styles.panel}>{content}</View>;
}

function ContactItem({
  icon,
  label,
  value,
  scale,
  compact,
  isWide = false,
  iconColor = colors.gold,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  scale: number;
  compact?: boolean;
  isWide?: boolean;
  iconColor?: string;
  onPress: () => void;
}) {
  const iconSize = Math.round((compact ? 26 : isWide ? 36 : 30) * scale);
  const labelSize = Math.round((compact ? 11 : isWide ? 15 : 13) * scale);
  const valueSize = Math.round((compact ? 14 : isWide ? 19 : 17) * scale);

  return (
    <Pressable
      style={[
        styles.contactCard,
        compact && styles.contactCardCompact,
        isWide && styles.contactCardWide,
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      <Text style={[styles.contactLabel, { fontSize: labelSize }]}>
        {label}
      </Text>
      <Text style={[styles.contactValue, { fontSize: valueSize }]}>
        {value}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    minWidth: 280,
  },
  panelFill: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'center',
  },
  panelScroll: {
    flex: 1,
  },
  panelScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    width: '100%',
  },
  logoWrap: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
  },
  formHeading: {
    color: colors.goldLight,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
  sectionBox: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  sectionBoxCompact: {
    padding: spacing.sm,
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
    padding: spacing.md,
    gap: 12,
    alignItems: 'flex-start',
  },
  noticeBoxCompact: {
    padding: spacing.sm,
    gap: 8,
  },
  noticeText: {
    flex: 1,
    color: colors.text,
    letterSpacing: 0.4,
    fontWeight: '600',
  },
  noticeTextWide: {
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  contactBlock: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    gap: spacing.sm,
    alignItems: 'stretch',
  },
  contactBlockCompact: {
    padding: spacing.sm,
    gap: spacing.xs,
  },
  contactCard: {
    flex: 0.95,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 8,
  },
  contactCardCompact: {
    paddingVertical: 10,
    gap: 6,
  },
  contactCardWide: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    gap: 10,
  },
  contactLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  contactValue: {
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  qrSection: {
    flex: 1.35,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  qrSectionCompact: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  qrImage: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
  },
});
