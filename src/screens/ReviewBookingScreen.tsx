import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { VEHICLE_IMAGES } from '../constants/vehicleImages';
import { getVehicleOption } from '../constants/vehicleOptions';
import GoldButton from '../components/booking/GoldButton';
import Screen from '../components/Screen';
import { useBooking } from '../context/BookingContext';
import { isMeaningfulVia } from '../types/booking';
import { useResponsive } from '../hooks/useResponsive';
import { colors, radius, spacing } from '../theme';
import { formatPreferredPickup } from '../utils/dateTime';
import { formatGBP, getVehicleLabel } from '../utils/pricing';

function DetailRow({
  icon,
  label,
  value,
  compact,
  scale,
  inline,
  wrapValue,
  subtext,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  compact?: boolean;
  scale?: number;
  inline?: boolean;
  wrapValue?: boolean;
  subtext?: string;
}) {
  if (!value) return null;
  const iconSize = Math.round((compact ? 24 : 22) * (scale ?? 1));
  const clampLines = wrapValue ? undefined : compact || inline ? 1 : undefined;
  const valueSize = scale
    ? {
        fontSize: Math.round((compact ? 19 : 17) * scale),
        lineHeight: Math.round((compact ? 28 : 26) * scale),
      }
    : null;
  return (
    <View
      style={[
        styles.detailRow,
        compact && styles.detailRowCompact,
        inline && styles.detailRowInline,
      ]}
    >
      <View style={styles.detailRowInner}>
        <Ionicons name={icon} size={iconSize} color={colors.gold} style={styles.detailIcon} />
        <View style={styles.detailTextCol}>
          <Text
            style={[
              styles.detailLabel,
              compact && styles.detailLabelCompact,
              scale ? { fontSize: Math.round((compact ? 15 : 14) * scale) } : null,
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.detailValue,
              compact && styles.detailValueCompact,
              wrapValue && styles.detailValueWrap,
              valueSize,
            ]}
            numberOfLines={clampLines}
            ellipsizeMode={clampLines ? 'tail' : undefined}
          >
            {value}
          </Text>
          {subtext ? (
            <Text
              style={[
                styles.detailSubtext,
                compact && styles.detailSubtextCompact,
                scale ? { fontSize: Math.round((compact ? 15 : 14) * scale) } : null,
              ]}
            >
              {subtext}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function TaggedInfoBlock({
  icon,
  label,
  compact,
  scale,
  inline = true,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  compact?: boolean;
  scale?: number;
  inline?: boolean;
  children: ReactNode;
}) {
  const iconSize = Math.round((compact ? 24 : 22) * (scale ?? 1));
  return (
    <View
      style={[
        styles.detailRow,
        compact && styles.detailRowCompact,
        inline && styles.detailRowInline,
      ]}
    >
      <View style={styles.detailRowInner}>
        <Ionicons name={icon} size={iconSize} color={colors.gold} style={styles.detailIcon} />
        <View style={styles.detailTextCol}>
          <Text
            style={[
              styles.detailLabel,
              compact && styles.detailLabelCompact,
              scale ? { fontSize: Math.round((compact ? 15 : 14) * scale) } : null,
            ]}
          >
            {label}
          </Text>
          {children}
        </View>
      </View>
    </View>
  );
}

function DetailRowPair({
  left,
  right,
  compact,
  scale,
  wrapLeft,
}: {
  left: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
  };
  right: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
  };
  compact?: boolean;
  scale?: number;
  wrapLeft?: boolean;
}) {
  if (!left.value && !right.value) return null;

  return (
    <View style={[styles.detailPairRow, compact && styles.detailPairRowCompact]}>
      <View style={styles.detailPairCell}>
        {left.value ? (
          <DetailRow {...left} compact={compact} scale={scale} inline wrapValue={wrapLeft} />
        ) : null}
      </View>
      <View style={styles.detailPairCell}>
        {right.value ? (
          <DetailRow {...right} compact={compact} scale={scale} inline />
        ) : null}
      </View>
    </View>
  );
}

export default function ReviewBookingScreen() {
  const { pendingBooking, goBackToEstimate, submitBookingRequest, isSubmitting } =
    useBooking();
  const {
    scale,
    contentPadding,
    screenPaddingTop,
    screenPaddingBottom,
    fitToScreen,
    maxContentWidth,
    columnGap,
  } = useResponsive();

  if (!pendingBooking) {
    return null;
  }

  const compact = fitToScreen;
  const titleSize = Math.round((compact ? 30 : 26) * scale);
  const backIconSize = Math.round((compact ? 32 : 22) * scale);
  const backHitSize = backIconSize + Math.round(spacing.md * 2);
  const vehicleImageHeight = compact ? undefined : Math.round(180 * scale);
  const actionRowMinHeight = Math.round((compact ? 58 : 52) * scale);
  const totalSize = Math.round((compact ? 46 : 40) * scale);
  const selectedService = getVehicleOption(pendingBooking.vehicleType);
  const pagePadding = {
    paddingHorizontal: contentPadding,
    paddingTop: screenPaddingTop,
    paddingBottom: screenPaddingBottom,
  };

  const refCard = (
    <View style={[styles.refCard, compact && styles.refCardCompact]}>
      <View style={styles.refCardInner}>
        <Ionicons
          name="ticket-outline"
          size={Math.round((compact ? 26 : 24) * scale)}
          color={colors.gold}
        />
        <View style={styles.refTextCol}>
          <Text style={[styles.refLabel, compact && styles.refLabelCompact]}>BOOKING REFERENCE</Text>
          <Text
            style={[
              styles.refValue,
              compact && styles.refValueCompact,
              compact ? { fontSize: Math.round(22 * scale) } : scale ? { fontSize: Math.round(20 * scale) } : null,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {pendingBooking.bookingRef || 'Assigned when you confirm'}
          </Text>
        </View>
      </View>
    </View>
  );

  const customerSection = (
    <View
      style={[
        styles.sectionCard,
        compact && styles.sectionCardCompact,
        compact && styles.customerCardCompact,
      ]}
    >
      <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>CUSTOMER DETAILS</Text>
      <DetailRowPair
        compact={compact}
        scale={scale}
        left={{ icon: 'person-outline', label: 'Name', value: pendingBooking.customerName }}
        right={{ icon: 'call-outline', label: 'Phone', value: pendingBooking.contactNumber }}
      />
      <DetailRow icon="mail-outline" label="Email" value={pendingBooking.email} compact={compact} scale={scale} />
    </View>
  );

  const journeySection = (
    <View
      style={[
        styles.sectionCard,
        compact && styles.sectionCardCompact,
        compact && styles.journeyCardCompact,
      ]}
    >
      <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>JOURNEY DETAILS</Text>
      <DetailRowPair
        compact={compact}
        scale={scale}
        wrapLeft
        left={{ icon: 'business-outline', label: 'Pickup', value: pendingBooking.from }}
        right={{ icon: 'location-outline', label: 'Drop-off', value: pendingBooking.to }}
      />
      <DetailRowPair
        compact={compact}
        scale={scale}
        left={{
          icon: 'people-outline',
          label: 'Passengers',
          value: String(pendingBooking.passengers ?? 1),
        }}
        right={{ icon: 'key-outline', label: 'Room no.', value: pendingBooking.roomNo ?? '' }}
      />
      {isMeaningfulVia(pendingBooking.via) ? (
        <DetailRow
          icon="git-merge-outline"
          label="Via"
          value={pendingBooking.via}
          compact={compact}
          scale={scale}
        />
      ) : null}
      <DetailRow
        icon="time-outline"
        label="Preferred pickup"
        value={
          pendingBooking.preferredPickupAt
            ? formatPreferredPickup(pendingBooking.preferredPickupAt)
            : ''
        }
        compact={compact}
        scale={scale}
      />
    </View>
  );

  const vehicleSection = (
    <View style={[styles.sectionCard, compact && styles.sectionCardCompact, compact && styles.vehicleCardCompact]}>
      <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>SELECTED VEHICLE</Text>
      <View style={[styles.vehicleImageWrap, compact && styles.vehicleImageWrapCompact]}>
        <Image
          source={VEHICLE_IMAGES[pendingBooking.vehicleType]}
          style={[
            styles.vehicleImage,
            compact && styles.vehicleImageCompact,
            vehicleImageHeight != null ? { height: vehicleImageHeight } : null,
          ]}
          resizeMode="contain"
          accessibilityLabel={`${getVehicleLabel(pendingBooking.vehicleType)} vehicle`}
        />
      </View>
      <View style={[styles.detailPairRow, compact && styles.detailPairRowCompact]}>
        <View style={styles.detailPairCell}>
          <TaggedInfoBlock icon="car-sport-outline" label="Vehicle" compact={compact} scale={scale}>
            <Text
              style={[
                styles.detailValue,
                compact && styles.detailValueCompact,
                scale
                  ? {
                      fontSize: Math.round((compact ? 19 : 17) * scale),
                      lineHeight: Math.round((compact ? 28 : 26) * scale),
                    }
                  : null,
              ]}
              numberOfLines={compact ? 1 : undefined}
              ellipsizeMode={compact ? 'tail' : undefined}
            >
              {getVehicleLabel(pendingBooking.vehicleType)}
            </Text>
            {selectedService?.tagline ? (
              <Text
                style={[
                  styles.detailSubtext,
                  compact && styles.detailSubtextCompact,
                  scale ? { fontSize: Math.round((compact ? 15 : 14) * scale) } : null,
                ]}
              >
                {selectedService.tagline}
              </Text>
            ) : null}
          </TaggedInfoBlock>
        </View>
        <View style={styles.detailPairCell}>
          <DetailRow
            icon="speedometer-outline"
            label="Distance"
            value={`${pendingBooking.distanceMiles} mi`}
            compact={compact}
            scale={scale}
            inline
          />
        </View>
      </View>
      <DetailRow
        icon="time-outline"
        label="Est. duration"
        value={
          pendingBooking.durationMinutes != null && pendingBooking.durationMinutes > 0
            ? `${pendingBooking.durationMinutes} min`
            : ''
        }
        compact={compact}
        scale={scale}
      />
    </View>
  );

  const totalCard = (
    <View
      style={[
        styles.totalCard,
        compact && styles.totalCardCompact,
        compact && { minHeight: actionRowMinHeight },
        !compact && styles.totalCardAfterJourney,
      ]}
    >
      <Text style={[styles.totalLabel, compact && styles.totalLabelCompact]}>ESTIMATED TOTAL</Text>
      <Text style={[styles.totalAmount, { fontSize: totalSize }]}>{formatGBP(pendingBooking.estimatedFare)}</Text>
    </View>
  );

  const confirmButton = (
    <GoldButton
      label={isSubmitting ? 'SUBMITTING…' : 'CONFIRM BOOKING'}
      icon="checkmark-circle-outline"
      scale={compact ? scale * 0.95 : scale * 1.05}
      style={[
        styles.confirmButton,
        compact && styles.confirmButtonCompact,
        compact && { minHeight: actionRowMinHeight },
      ]}
      onPress={isSubmitting ? undefined : submitBookingRequest}
    />
  );

  const pageBody = (
    <View
      style={[
        compact ? styles.pageFit : styles.page,
        { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
      ]}
    >
      {compact ? (
        <View style={styles.headerCompact}>
          <Pressable
            style={({ pressed }) => [
              styles.backRowCompact,
              { width: backHitSize, height: backHitSize },
              pressed && styles.backRowPressed,
            ]}
            onPress={goBackToEstimate}
            accessibilityRole="button"
            accessibilityLabel="Back to estimate"
          >
            <Ionicons name="arrow-back" size={backIconSize} color={colors.gold} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={[styles.title, styles.titleCompactHeader, { fontSize: titleSize }]}>
              REVIEW YOUR BOOKING
            </Text>
          </View>
          <View style={{ width: backHitSize }} />
        </View>
      ) : (
        <>
          <Pressable style={styles.backRow} onPress={goBackToEstimate}>
            <Ionicons name="arrow-back" size={backIconSize} color={colors.gold} />
            <Text style={styles.backText}>Back to estimate</Text>
          </Pressable>

          <View style={styles.titleSection}>
            <Text style={[styles.title, { fontSize: titleSize }]}>REVIEW YOUR BOOKING</Text>
            <Text style={styles.subtitle}>
              Please check your details and selected options before confirming.
            </Text>
          </View>
        </>
      )}

      {compact ? (
        <View style={[styles.contentRow, { gap: columnGap }]}>
          <View style={styles.leftColumn}>
            {refCard}
            <View style={styles.detailsSplit}>
              {customerSection}
              {journeySection}
            </View>
            {totalCard}
          </View>
          <View style={styles.rightColumn}>
            {vehicleSection}
            {confirmButton}
          </View>
        </View>
      ) : (
        <>
          {refCard}
          {customerSection}
          {journeySection}
          {totalCard}
          {vehicleSection}
          {confirmButton}
        </>
      )}
    </View>
  );

  return (
    <Screen style={styles.screen}>
      {compact ? (
        <View style={[styles.pageShell, pagePadding]}>{pageBody}</View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, pagePadding]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator
        >
          {pageBody}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pageShell: {
    flex: 1,
    minHeight: 0,
  },
  scroll: {
    flexGrow: 1,
  },
  page: {
    width: '100%',
  },
  pageFit: {
    flex: 1,
    minHeight: 0,
    gap: spacing.sm,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginBottom: 0,
  },
  headerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backRowCompact: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  backRowPressed: {
    opacity: 0.75,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCompactHeader: {
    marginBottom: 0,
    textAlign: 'center',
  },
  backText: {
    color: colors.gold,
    fontWeight: '600',
    fontSize: 16,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.goldLight,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
    fontSize: 16,
    lineHeight: 22,
  },
  contentRow: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  leftColumn: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    gap: spacing.xs,
  },
  detailsSplit: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'column',
    gap: spacing.xs,
  },
  rightColumn: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    gap: spacing.xs,
  },
  refCard: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundPanel,
  },
  refCardCompact: {
    marginBottom: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexShrink: 0,
  },
  refCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  refTextCol: {
    flex: 1,
    minWidth: 0,
  },
  refLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    fontSize: 14,
  },
  refLabelCompact: {
    fontSize: 15,
    marginBottom: 4,
  },
  refValue: {
    color: colors.goldLight,
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 1,
  },
  refValueCompact: {
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundPanel,
  },
  sectionCardCompact: {
    marginBottom: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    overflow: 'hidden',
  },
  customerCardCompact: {
    flex: 2,
    minHeight: 0,
    alignSelf: 'stretch',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  journeyCardCompact: {
    flex: 3,
    minHeight: 0,
    alignSelf: 'stretch',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  vehicleCardCompact: {
    flex: 1,
    minHeight: 0,
    alignSelf: 'stretch',
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  vehicleImageWrap: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  vehicleImageWrapCompact: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  vehicleImage: {
    width: '100%',
  },
  vehicleImageCompact: {
    flex: 1,
    width: '100%',
  },
  detailRow: {
    marginBottom: 14,
  },
  detailRowCompact: {
    marginBottom: 8,
  },
  detailRowInline: {
    marginBottom: 0,
    flex: 1,
    minWidth: 0,
  },
  detailPairRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: 14,
  },
  detailPairRowCompact: {
    gap: spacing.xs,
    marginBottom: 8,
  },
  detailPairCell: {
    flex: 1,
    minWidth: 0,
  },
  detailRowInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  detailIcon: {
    marginTop: 1,
  },
  detailTextCol: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    fontSize: 16,
  },
  sectionTitleCompact: {
    fontSize: 17,
    marginBottom: spacing.xs,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  detailLabelCompact: {
    marginBottom: 2,
  },
  detailValue: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 26,
    marginTop: 0,
  },
  detailValueCompact: {
    fontWeight: '600',
  },
  detailSubtext: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
    opacity: 0.85,
  },
  detailSubtextCompact: {
    marginTop: 2,
  },
  detailValueWrap: {
    flexShrink: 1,
  },
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignSelf: 'stretch',
    width: '100%',
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundPanel,
    gap: spacing.sm,
  },
  totalCardCompact: {
    marginTop: 0,
    marginBottom: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexShrink: 0,
  },
  totalCardAfterJourney: {
    marginTop: spacing.xs,
  },
  totalLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 0,
    textAlign: 'left',
    flexShrink: 1,
    fontSize: 15,
  },
  totalLabelCompact: {
    fontSize: 16,
    letterSpacing: 1,
  },
  totalAmount: {
    color: colors.goldLight,
    fontWeight: '700',
    textAlign: 'right',
    flexShrink: 0,
  },
  confirmButton: {
    alignSelf: 'stretch',
    marginBottom: spacing.md,
  },
  confirmButtonCompact: {
    flexShrink: 0,
    alignSelf: 'stretch',
    marginBottom: 0,
    marginTop: 0,
  },
});
