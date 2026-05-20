import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import GoldButton from '../components/booking/GoldButton';
import Screen from '../components/Screen';
import { useBooking } from '../context/BookingContext';
import { useResponsive } from '../hooks/useResponsive';
import { BOOKING_MESSAGES } from '../types/booking';
import { colors, radius, spacing } from '../theme';
import { formatPreferredPickup } from '../utils/dateTime';
import { formatGBP } from '../utils/pricing';

export default function BookingStatusScreen() {
  const { submittedBooking, goHomeAndClearCache, isCheckingAvailability } = useBooking();
  const { scale, contentPadding, screenPaddingTop, screenPaddingBottom } = useResponsive();

  if (!submittedBooking) {
    return null;
  }

  const { status } = submittedBooking;

  const statusConfig = {
    pending: {
      icon: 'time-outline' as const,
      title: 'REQUEST SUBMITTED',
      message: BOOKING_MESSAGES.pending,
      color: colors.gold,
    },
    accepted: {
      icon: 'checkmark-circle-outline' as const,
      title: 'BOOKING ACCEPTED',
      message: BOOKING_MESSAGES.accepted,
      color: '#4ade80',
    },
    declined: {
      icon: 'close-circle-outline' as const,
      title: 'UNAVAILABLE',
      message: BOOKING_MESSAGES.declined,
      color: '#f87171',
    },
    draft: {
      icon: 'document-outline' as const,
      title: 'BOOKING',
      message: '',
      color: colors.gold,
    },
  };

  const config = statusConfig[status] ?? statusConfig.pending;

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
          {isCheckingAvailability ? (
            <ActivityIndicator size="large" color={colors.gold} />
          ) : (
            <Ionicons name={config.icon} size={56} color={config.color} />
          )}
        </View>

        <Text style={[styles.title, { fontSize: Math.round(22 * scale) }]}>{config.title}</Text>
        <Text style={styles.message}>{config.message}</Text>

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
          <Text style={styles.fareLine}>
            Estimated fare: {formatGBP(submittedBooking.estimatedFare)}
          </Text>
        </View>

        {status === 'pending' && isCheckingAvailability ? (
          <Text style={styles.checkingNote}>Checking availability with our operators…</Text>
        ) : null}

        {status !== 'pending' ? (
          <GoldButton
            label="BACK TO HOME"
            icon="home-outline"
            scale={scale}
            onPress={goHomeAndClearCache}
            style={styles.homeButton}
          />
        ) : null}
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
    height: 64,
    justifyContent: 'center',
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
  checkingNote: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 13,
    marginBottom: spacing.md,
  },
  homeButton: {
    alignSelf: 'stretch',
    width: '100%',
  },
});
