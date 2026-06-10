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
import { formatGBP } from '../utils/pricing';

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
  const panelMaxWidth = Math.min(maxContentWidth * (compact ? 0.5 : 0.72), compact ? 460 : 420);
  const titleSize = Math.round((compact ? 30 : 28) * scale);
  const messageSize = Math.round((compact ? 17 : 17) * scale);
  const noticeSize = Math.round((compact ? 20 : 17) * scale);
  const referenceSize = Math.round((compact ? 22 : 22) * scale);
  const summarySize = Math.round((compact ? 16 : 17) * scale);
  const fareSize = Math.round((compact ? 17 : 18) * scale);
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
        <View style={[styles.noticeCard, compact && styles.noticeCardFit]}>
          <Ionicons name="notifications-outline" size={Math.round((compact ? 28 : 26) * scale)} color={colors.gold} />
          <Text
            style={[
              styles.noticeText,
              { fontSize: noticeSize, lineHeight: Math.round(noticeSize * 1.45) },
            ]}
          >
            {BOOKING_MESSAGES.pendingNotice}
          </Text>
        </View>
      ) : null}

      <View style={[styles.summaryCard, compact && styles.summaryCardFit]}>
        <Text style={[styles.summaryLabel, { fontSize: Math.round((compact ? 14 : 15) * scale) }]}>
          BOOKING REFERENCE
        </Text>
        <Text style={[styles.reference, compact && styles.referenceFit, { fontSize: referenceSize }]}>
          {submittedBooking.bookingRef}
        </Text>

        <Text
          style={[styles.summaryLine, compact && styles.summaryLineFit, { fontSize: summarySize }]}
          numberOfLines={compact ? 1 : undefined}
          ellipsizeMode={compact ? 'tail' : undefined}
        >
          {submittedBooking.from} → {submittedBooking.to}
        </Text>
        {submittedBooking.preferredPickupAt ? (
          <Text
            style={[styles.summaryLine, compact && styles.summaryLineFit, { fontSize: summarySize }]}
            numberOfLines={compact ? 1 : undefined}
            ellipsizeMode={compact ? 'tail' : undefined}
          >
            Preferred pickup: {formatPreferredPickup(submittedBooking.preferredPickupAt)}
          </Text>
        ) : null}
        {submittedBooking.roomNo ? (
          <Text style={[styles.summaryLine, compact && styles.summaryLineFit, { fontSize: summarySize }]}>
            Room no.: {submittedBooking.roomNo}
          </Text>
        ) : null}
        <Text style={[styles.summaryLine, compact && styles.summaryLineFit, { fontSize: summarySize }]}>
          Passengers: {submittedBooking.passengers ?? 1}
        </Text>
        <Text style={[styles.fareLine, compact && styles.fareLineFit, { fontSize: fareSize }]}>
          Estimated fare: {formatGBP(submittedBooking.estimatedFare)}
        </Text>
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
      {compact ? (
        <View style={[styles.pageShell, pagePadding]}>{panelBody}</View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scroll, pagePadding]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {panelBody}
        </ScrollView>
      )}
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
  pageShell: {
    flex: 1,
    minHeight: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
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
  noticeText: {
    color: colors.textMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
  summaryCard: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.backgroundPanel,
    marginBottom: spacing.lg,
  },
  summaryCardFit: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  reference: {
    color: colors.goldLight,
    fontWeight: '700',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  referenceFit: {
    marginBottom: spacing.xs,
  },
  summaryLine: {
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 24,
    textAlign: 'center',
  },
  summaryLineFit: {
    marginBottom: 4,
    lineHeight: 22,
  },
  fareLine: {
    color: colors.gold,
    fontWeight: '700',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  fareLineFit: {
    marginTop: 2,
  },
  homeButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
