import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import GoldButton from '../components/booking/GoldButton';
import Screen from '../components/Screen';
import { useBooking } from '../context/BookingContext';
import { useResponsive } from '../hooks/useResponsive';
import { colors, radius, spacing } from '../theme';
import { formatPreferredPickup } from '../utils/dateTime';
import { formatGBP, getVehicleLabel } from '../utils/pricing';

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function ReviewBookingScreen() {
  const { pendingBooking, goBackToEstimate, submitBookingRequest } = useBooking();
  const { scale, contentPadding, screenPaddingTop, screenPaddingBottom } = useResponsive();

  if (!pendingBooking) {
    return null;
  }

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
        <Pressable style={styles.backRow} onPress={goBackToEstimate}>
          <Ionicons name="arrow-back" size={20} color={colors.gold} />
          <Text style={styles.backText}>Back to estimate</Text>
        </Pressable>

        <Text style={[styles.title, { fontSize: Math.round(22 * scale) }]}>
          REVIEW YOUR BOOKING
        </Text>
        <Text style={styles.subtitle}>
          Please check your details and selected options before confirming.
        </Text>

        <View style={styles.refCard}>
          <Text style={styles.refLabel}>BOOKING REFERENCE</Text>
          <Text style={styles.refValue}>{pendingBooking.bookingRef}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>CUSTOMER DETAILS</Text>
          <DetailRow label="Name" value={pendingBooking.customerName} />
          <DetailRow label="Phone" value={pendingBooking.contactNumber} />
          <DetailRow label="Email" value={pendingBooking.email} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>JOURNEY DETAILS</Text>
          <DetailRow label="From" value={pendingBooking.from} />
          <DetailRow label="Via" value={pendingBooking.via} />
          <DetailRow label="To" value={pendingBooking.to} />
          <DetailRow
            label="Preferred pickup"
            value={
              pendingBooking.preferredPickupAt
                ? formatPreferredPickup(pendingBooking.preferredPickupAt)
                : ''
            }
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>SELECTED OPTIONS</Text>
          <DetailRow label="Vehicle" value={getVehicleLabel(pendingBooking.vehicleType)} />
          <DetailRow
            label="Distance"
            value={`${pendingBooking.distanceMiles} mile${
              pendingBooking.distanceMiles === 1 ? '' : 's'
            }`}
          />
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>ESTIMATED TOTAL</Text>
          <Text style={[styles.totalAmount, { fontSize: Math.round(36 * scale) }]}>
            {formatGBP(pendingBooking.estimatedFare)}
          </Text>
        </View>

        <GoldButton
          label="CONFIRM BOOKING"
          icon="checkmark-circle-outline"
          scale={scale}
          style={styles.confirmButton}
          onPress={submitBookingRequest}
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
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  backText: {
    color: colors.gold,
    fontWeight: '600',
    fontSize: 14,
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
    marginTop: 6,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  refCard: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundPanel,
  },
  refLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  refValue: {
    color: colors.goldLight,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1,
  },
  sectionCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundPanel,
  },
  sectionTitle: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  detailRow: {
    marginBottom: 10,
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  detailValue: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  totalCard: {
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundPanel,
  },
  totalLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  totalAmount: {
    color: colors.goldLight,
    fontWeight: '700',
  },
  confirmButton: {
    alignSelf: 'stretch',
    marginBottom: spacing.md,
  },
});
