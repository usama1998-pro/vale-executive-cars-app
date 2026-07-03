import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AnimatedSuccessTick from '../components/booking/AnimatedSuccessTick';
import GoldenConfettiBurst from '../components/booking/GoldenConfettiBurst';
import GoldButton from '../components/booking/GoldButton';
import Screen from '../components/Screen';
import { useBooking } from '../context/BookingContext';
import { useResponsive } from '../hooks/useResponsive';
import { BOOKING_MESSAGES } from '../types/booking';
import { colors, radius, spacing } from '../theme';
import { formatPreferredPickup } from '../utils/dateTime';
import { formatGBP, getVehicleLabel } from '../utils/pricing';

const EMPTY_FIELD = '—';

function displayText(value?: string | null): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : EMPTY_FIELD;
}

function SummaryField({
  label,
  value,
  compact,
  fontSize,
  splitRow = false,
}: {
  label: string;
  value: string;
  compact: boolean;
  fontSize: number;
  splitRow?: boolean;
}) {
  if (compact && splitRow) {
    return (
      <View style={styles.summaryFieldRow}>
        <Text style={[styles.summaryFieldLabel, { fontSize }]}>{label}</Text>
        <Text
          style={[styles.summaryFieldValue, { fontSize, lineHeight: Math.round(fontSize * 1.35) }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
      </View>
    );
  }

  return (
    <Text
      style={[styles.summaryLine, compact && styles.summaryLineFit, { fontSize }]}
      numberOfLines={compact ? 1 : undefined}
      ellipsizeMode={compact ? 'tail' : undefined}
    >
      {label}: {value}
    </Text>
  );
}

function FareCard({
  compact,
  labelSize,
  amountSize,
  amount,
}: {
  compact: boolean;
  labelSize: number;
  amountSize: number;
  amount: number;
}) {
  return (
    <View style={[styles.fareCard, compact && styles.fareCardFit]}>
      <Text style={[styles.fareLabel, { fontSize: labelSize }]}>ESTIMATED FARE</Text>
      <Text style={[styles.fareAmount, { fontSize: amountSize }]}>{formatGBP(amount)}</Text>
    </View>
  );
}

function SummarySection({
  title,
  compact,
  fontSize,
  splitLayout = false,
  children,
}: {
  title: string;
  compact: boolean;
  fontSize: number;
  splitLayout?: boolean;
  children: ReactNode;
}) {
  return (
    <View
      style={[
        styles.summarySection,
        styles.summarySectionBordered,
        compact && styles.summarySectionFit,
        splitLayout && styles.summarySectionSplit,
      ]}
    >
      <Text
        style={[
          styles.summarySectionTitle,
          splitLayout && styles.summarySectionTitleSplit,
          { fontSize },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

export default function BookingStatusScreen() {
  const { submittedBooking, goHomeAndClearCache } = useBooking();
  const {
    scale,
    width,
    height,
    contentPadding,
    screenPaddingTop,
    screenPaddingBottom,
    maxContentWidth,
    fitToScreen,
  } = useResponsive();

  if (!submittedBooking) {
    return null;
  }

  const compact = fitToScreen;
  const { status } = submittedBooking;
  const panelMaxWidth = Math.min(maxContentWidth * (compact ? 0.96 : 0.72), compact ? 960 : 420);
  const splitSummary = compact;
  const splitField = compact;
  const titleSize = Math.round((compact ? 30 : 28) * scale);
  const messageSize = Math.round((compact ? 17 : 17) * scale);
  const noticeSize = Math.round((compact ? 20 : 17) * scale);
  const referenceSize = Math.round((compact ? 22 : 22) * scale);
  const summarySize = Math.round((compact ? 16 : 17) * scale);
  const sectionTitleSize = Math.round((compact ? 16 : 17) * scale);
  const summaryLabelSize = Math.round((compact ? 16 : 17) * scale);
  const fareLabelSize = Math.round((compact ? 15 : 16) * scale);
  const fareAmountSize = Math.round((compact ? 28 : 32) * scale);
  const tickSize = Math.round((compact ? 84 : 92) * scale);
  const pagePadding = {
    paddingHorizontal: contentPadding,
    paddingTop: screenPaddingTop,
    paddingBottom: screenPaddingBottom,
  };

  const statusConfig = {
    pending: {
      icon: 'checkmark-circle-outline' as const,
      title: 'BOOKING SUBMITTED',
      message: BOOKING_MESSAGES.pending,
      color: colors.yellow,
    },
    accepted: {
      icon: 'checkmark-circle-outline' as const,
      title: 'BOOKING ACCEPTED',
      message: BOOKING_MESSAGES.accepted,
      color: colors.yellow,
    },
    declined: {
      icon: 'close-circle-outline' as const,
      title: 'UNAVAILABLE',
      message: BOOKING_MESSAGES.declined,
      color: colors.yellow,
    },
    draft: {
      icon: 'document-outline' as const,
      title: 'BOOKING',
      message: '',
      color: colors.gold,
    },
  };

  const config = statusConfig[status] ?? statusConfig.pending;
  const showSuccessTick = status === 'pending' || status === 'accepted';
  const pickupDisplay = submittedBooking.preferredPickupAt
    ? formatPreferredPickup(submittedBooking.preferredPickupAt)
    : EMPTY_FIELD;
  const durationDisplay =
    submittedBooking.durationMinutes != null && submittedBooking.durationMinutes > 0
      ? `${submittedBooking.durationMinutes} min`
      : EMPTY_FIELD;

  const confettiSpread = Math.round(
    compact
      ? Math.max(width * 0.48, height * 0.56)
      : Math.max(width * 0.42, height * 0.5),
  );
  const confettiCount = compact ? 42 : 36;
  const panelBody = (
    <View style={[styles.panel, compact && styles.panelFit, { maxWidth: panelMaxWidth }]}>
      <View style={[styles.iconWrap, compact && styles.iconWrapFit]}>
        {showSuccessTick ? (
          <AnimatedSuccessTick size={tickSize} ringColor={config.color} />
        ) : (
          <Ionicons name={config.icon} size={Math.round(60 * scale)} color={config.color} />
        )}
      </View>

      <Text style={[styles.title, compact && styles.titleFit, { fontSize: titleSize }]}>{config.title}</Text>
      <Text
        style={[
          styles.message,
          compact && styles.messageFit,
          { fontSize: messageSize, lineHeight: Math.round(messageSize * 1.4) },
        ]}
      >
        {config.message}
      </Text>

      {status === 'pending' ? (
        <View style={[styles.noticeCard, compact && styles.noticeCardFit, splitSummary && styles.noticeCardSplit]}>
          <Ionicons name="notifications-outline" size={Math.round((compact ? 24 : 26) * scale)} color={colors.gold} />
          <Text
            style={[
              styles.noticeText,
              splitSummary && styles.noticeTextSplit,
              { fontSize: noticeSize, lineHeight: Math.round(noticeSize * 1.45) },
            ]}
          >
            {BOOKING_MESSAGES.pendingNotice}
          </Text>
        </View>
      ) : null}

      <View style={[styles.summaryCard, compact && styles.summaryCardFit]}>
        <View style={[styles.summarySection, styles.summarySectionBordered, compact && styles.summarySectionFit]}>
          <Text style={[styles.summaryLabel, { fontSize: summaryLabelSize }]}>BOOKING REFERENCE</Text>
          <Text style={[styles.reference, compact && styles.referenceFit, { fontSize: referenceSize }]}>
            {displayText(submittedBooking.bookingRef)}
          </Text>
        </View>

        {splitSummary ? (
          <View style={styles.summaryColumns}>
            <View style={styles.summaryColumn}>
              <SummarySection
                title="CUSTOMER DETAILS"
                compact={compact}
                fontSize={sectionTitleSize}
                splitLayout
              >
                <SummaryField
                  label="Name"
                  value={displayText(submittedBooking.customerName)}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
                <SummaryField
                  label="Phone"
                  value={displayText(submittedBooking.contactNumber)}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
                <SummaryField
                  label="Email"
                  value={displayText(submittedBooking.email)}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
                <SummaryField
                  label="Passengers"
                  value={String(submittedBooking.passengers ?? 1)}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
                <SummaryField
                  label="Room no."
                  value={displayText(submittedBooking.roomNo)}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
              </SummarySection>

              <SummarySection
                title="JOURNEY DETAILS"
                compact={compact}
                fontSize={sectionTitleSize}
                splitLayout
              >
                <SummaryField
                  label="Pickup"
                  value={displayText(submittedBooking.from)}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
                <SummaryField
                  label="Drop-off"
                  value={displayText(submittedBooking.to)}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
                <SummaryField
                  label="Preferred pickup"
                  value={pickupDisplay}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
                {submittedBooking.note?.trim() ? (
                  <SummaryField
                    label="Note"
                    value={displayText(submittedBooking.note)}
                    compact={compact}
                    fontSize={summarySize}
                    splitRow={splitField}
                  />
                ) : null}
              </SummarySection>
            </View>

            <View style={styles.summaryColumn}>
              <SummarySection
                title="SELECTED VEHICLE"
                compact={compact}
                fontSize={sectionTitleSize}
                splitLayout
              >
                <SummaryField
                  label="Vehicle"
                  value={getVehicleLabel(submittedBooking.vehicleType)}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
                <SummaryField
                  label="Distance"
                  value={`${submittedBooking.distanceMiles} mi`}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
                <SummaryField
                  label="Est. duration"
                  value={durationDisplay}
                  compact={compact}
                  fontSize={summarySize}
                  splitRow={splitField}
                />
              </SummarySection>

              <FareCard
                compact={compact}
                labelSize={fareLabelSize}
                amountSize={fareAmountSize}
                amount={submittedBooking.estimatedFare}
              />
            </View>
          </View>
        ) : (
          <>
            <SummarySection title="CUSTOMER DETAILS" compact={compact} fontSize={sectionTitleSize}>
              <SummaryField
                label="Name"
                value={displayText(submittedBooking.customerName)}
                compact={compact}
                fontSize={summarySize}
              />
              <SummaryField
                label="Phone"
                value={displayText(submittedBooking.contactNumber)}
                compact={compact}
                fontSize={summarySize}
              />
              <SummaryField
                label="Email"
                value={displayText(submittedBooking.email)}
                compact={compact}
                fontSize={summarySize}
              />
              <SummaryField
                label="Passengers"
                value={String(submittedBooking.passengers ?? 1)}
                compact={compact}
                fontSize={summarySize}
              />
              <SummaryField
                label="Room no."
                value={displayText(submittedBooking.roomNo)}
                compact={compact}
                fontSize={summarySize}
              />
            </SummarySection>

            <SummarySection title="JOURNEY DETAILS" compact={compact} fontSize={sectionTitleSize}>
              <SummaryField
                label="Pickup"
                value={displayText(submittedBooking.from)}
                compact={compact}
                fontSize={summarySize}
              />
              <SummaryField
                label="Drop-off"
                value={displayText(submittedBooking.to)}
                compact={compact}
                fontSize={summarySize}
              />
              <SummaryField
                label="Preferred pickup"
                value={pickupDisplay}
                compact={compact}
                fontSize={summarySize}
              />
              {submittedBooking.note?.trim() ? (
                <SummaryField
                  label="Note"
                  value={displayText(submittedBooking.note)}
                  compact={compact}
                  fontSize={summarySize}
                />
              ) : null}
            </SummarySection>

            <SummarySection title="SELECTED VEHICLE" compact={compact} fontSize={sectionTitleSize}>
              <SummaryField
                label="Vehicle"
                value={getVehicleLabel(submittedBooking.vehicleType)}
                compact={compact}
                fontSize={summarySize}
              />
              <SummaryField
                label="Distance"
                value={`${submittedBooking.distanceMiles} mi`}
                compact={compact}
                fontSize={summarySize}
              />
              <SummaryField
                label="Est. duration"
                value={durationDisplay}
                compact={compact}
                fontSize={summarySize}
              />
            </SummarySection>

            <FareCard
              compact={compact}
              labelSize={fareLabelSize}
              amountSize={fareAmountSize}
              amount={submittedBooking.estimatedFare}
            />
          </>
        )}
      </View>

      <GoldButton
        label="BACK TO HOME"
        icon="home-outline"
        scale={compact ? scale * 0.95 : scale * 1.05}
        onPress={goHomeAndClearCache}
        style={styles.homeButton}
      />
    </View>
  );

  return (
    <Screen style={styles.screen}>
      {showSuccessTick ? (
        <View style={styles.confettiOverlay} pointerEvents="none">
          <GoldenConfettiBurst
            origin="bottomLeft"
            spread={confettiSpread}
            particleCount={confettiCount}
            style={styles.confettiBottomLeft}
          />
          <GoldenConfettiBurst
            origin="bottomRight"
            spread={confettiSpread}
            particleCount={confettiCount}
            style={styles.confettiBottomRight}
          />
        </View>
      ) : null}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, pagePadding, compact && styles.scrollCompact]}
        showsVerticalScrollIndicator={compact}
        bounces={false}
      >
        {panelBody}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  confettiOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    overflow: 'hidden',
  },
  confettiBottomLeft: {
    left: spacing.xl,
    bottom: spacing.lg,
  },
  confettiBottomRight: {
    right: spacing.xl,
    bottom: spacing.lg,
  },
  scrollView: {
    flex: 1,
    overflow: 'hidden',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollCompact: {
    justifyContent: 'flex-start',
  },
  panel: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  panelFit: {
    flexShrink: 1,
    justifyContent: 'center',
    gap: spacing.xs,
  },
  iconWrap: {
    marginBottom: spacing.lg,
    minHeight: 96,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  iconWrapFit: {
    marginBottom: spacing.xs,
    minHeight: 0,
  },
  title: {
    color: colors.goldLight,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  titleFit: {
    marginBottom: spacing.xs,
  },
  message: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  messageFit: {
    marginBottom: spacing.xs,
  },
  noticeCard: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.backgroundPanel,
    marginBottom: spacing.lg,
  },
  noticeCardFit: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  noticeCardSplit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  noticeText: {
    color: colors.textMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
  noticeTextSplit: {
    flex: 1,
    textAlign: 'left',
  },
  summaryCard: {
    width: '100%',
    alignItems: 'stretch',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  summaryCardFit: {
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    color: colors.gold,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  reference: {
    color: colors.goldLight,
    fontWeight: '700',
    marginBottom: 0,
    textAlign: 'center',
  },
  referenceFit: {
    marginBottom: 0,
  },
  summarySection: {
    width: '100%',
    alignItems: 'center',
  },
  summarySectionBordered: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.backgroundPanel,
  },
  summarySectionFit: {
    padding: spacing.sm,
  },
  summarySectionSplit: {
    alignItems: 'stretch',
  },
  summaryColumns: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  summaryColumn: {
    flex: 1,
    minWidth: 0,
    gap: spacing.lg,
  },
  summarySectionTitle: {
    color: colors.gold,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  summarySectionTitleSplit: {
    textAlign: 'left',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  summaryFieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: 4,
  },
  summaryFieldLabel: {
    color: colors.textMuted,
    fontWeight: '700',
    flexShrink: 0,
    minWidth: 88,
  },
  summaryFieldValue: {
    color: colors.text,
    flex: 1,
    textAlign: 'right',
    fontWeight: '700',
  },
  summaryLine: {
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.sm,
    lineHeight: 24,
    textAlign: 'center',
  },
  summaryLineFit: {
    marginBottom: 4,
    lineHeight: 22,
  },
  fareCard: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundPanel,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  fareCardFit: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  fareLabel: {
    color: colors.gold,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  fareAmount: {
    color: colors.goldLight,
    fontWeight: '800',
    textAlign: 'center',
  },
  homeButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
