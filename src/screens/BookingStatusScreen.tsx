import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AnimatedSuccessTick from '../components/booking/AnimatedSuccessTick';
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
  const { scale, contentPadding, screenPaddingTop, screenPaddingBottom } = useResponsive();

  if (!submittedBooking) {
    return null;
  }

  const { status } = submittedBooking;

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

  return (
    <Screen style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingHorizontal: contentPadding,
            paddingTop: screenPaddingTop,
            paddingBottom: screenPaddingBottom,
          },
        ]}
      >
        <View style={styles.iconWrap}>
          {showSuccessTick ? (
            <AnimatedSuccessTick size={Math.round(80 * scale)} ringColor={config.color} />
          ) : (
            <Ionicons name={config.icon} size={56} color={config.color} />
          )}
        </View>

        <Text style={[styles.title, { fontSize: Math.round(22 * scale) }]}>{config.title}</Text>
        <Text style={styles.message}>{config.message}</Text>

        {status === 'pending' ? (
          <View style={styles.noticeCard}>
            <Ionicons name="notifications-outline" size={22} color={colors.gold} />
            <Text style={styles.noticeText}>{BOOKING_MESSAGES.pendingNotice}</Text>
          </View>
        ) : null}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>BOOKING REFERENCE</Text>
          <Text style={styles.reference}>{submittedBooking.bookingRef}</Text>

          <Text style={styles.summaryLine}>
            {submittedBooking.from} → {submittedBooking.to}
          </Text>
          {submittedBooking.preferredPickupAt ? (
            <Text style={styles.summaryLine}>
              Preferred pickup: {formatPreferredPickup(submittedBooking.preferredPickupAt)}
            </Text>
          ) : null}
          {submittedBooking.roomNo ? (
            <Text style={styles.summaryLine}>Room no.: {submittedBooking.roomNo}</Text>
          ) : null}
          <Text style={styles.fareLine}>
            Estimated fare: {formatGBP(submittedBooking.estimatedFare)}
          </Text>
        </View>

        <GoldButton
          label="BACK TO HOME"
          icon="home-outline"
          scale={scale}
          onPress={goHomeAndClearCache}
          style={styles.homeButton}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
  },
  iconWrap: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    minHeight: 88,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.goldLight,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  noticeCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.backgroundPanel,
    marginBottom: spacing.lg,
  },
  noticeText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  summaryCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.backgroundPanel,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  reference: {
    color: colors.goldLight,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: spacing.md,
  },
  summaryLine: {
    color: colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  fareLine: {
    color: colors.gold,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  homeButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
