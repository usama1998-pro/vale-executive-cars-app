import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FormInput from '../components/booking/FormInput';
import GoldButton from '../components/booking/GoldButton';
import Screen from '../components/Screen';
import { useBooking } from '../context/BookingContext';
import { useKeyboardPadding } from '../hooks/useKeyboardPadding';
import { useResponsive } from '../hooks/useResponsive';
import { VehicleType } from '../types/booking';
import { colors, radius, spacing } from '../theme';
import { calculateFare, formatGBP, PRICING } from '../utils/pricing';

const VEHICLES: { type: VehicleType; title: string; lines: string[] }[] = [
  {
    type: 'saloon',
    title: PRICING.saloon.label,
    lines: [
      'First 3 miles charged at £5 per mile',
      'Any additional miles charged at £3 per mile',
    ],
  },
  {
    type: 'executive',
    title: PRICING.executive.label,
    lines: ['Charged at £5 per mile'],
  },
  {
    type: 'mpv',
    title: PRICING.mpv.label,
    lines: ['Charged at 1.5× the Executive rate'],
  },
];

export default function EstimateScreen() {
  const {
    pendingBooking,
    goHome,
    updatePendingMiles,
    updatePendingVehicle,
    goToReview,
  } = useBooking();
  const {
    scale,
    contentPadding,
    screenPaddingTop,
    screenPaddingBottom,
    isTablet,
    isWide,
    columnGap,
    maxContentWidth,
  } = useResponsive();
  const keyboardPadding = useKeyboardPadding(32);
  const scrollRef = useRef<ScrollView>(null);

  if (!pendingBooking) {
    return null;
  }

  const milesText =
    pendingBooking.distanceMiles > 0 ? String(pendingBooking.distanceMiles) : '';

  const handleMilesChange = (text: string) => {
    const parsed = parseFloat(text.replace(/[^0-9.]/g, ''));
    updatePendingMiles(Number.isFinite(parsed) ? parsed : 0);
  };

  return (
    <Screen style={styles.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: contentPadding,
              paddingTop: screenPaddingTop,
              paddingBottom: screenPaddingBottom + keyboardPadding,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator
          automaticallyAdjustKeyboardInsets
          nestedScrollEnabled
        >
          <View style={[styles.page, { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' }]}>
          <Pressable style={styles.backRow} onPress={goHome}>
            <Ionicons name="arrow-back" size={20} color={colors.gold} />
            <Text style={styles.backText}>Back to booking</Text>
          </Pressable>

          <Text style={[styles.title, { fontSize: Math.round(22 * scale) }]}>
            ESTIMATED COST
          </Text>
          <Text style={styles.subtitle}>
            Select your vehicle and distance to see your estimated fare.
          </Text>

          <Text style={styles.sectionTitle}>PRICING STRUCTURE</Text>
          <View
            style={[
              styles.pricingGrid,
              isWide && styles.pricingGridThreeCol,
              isTablet && !isWide && styles.pricingGridTwoCol,
              { gap: columnGap },
            ]}
          >
            {VEHICLES.map((vehicle) => {
              const selected = pendingBooking.vehicleType === vehicle.type;
              const previewFare = calculateFare(pendingBooking.distanceMiles, vehicle.type);
              return (
                <Pressable
                  key={vehicle.type}
                  style={[
                    styles.priceCard,
                    isWide && styles.priceCardCol,
                    isTablet && !isWide && styles.priceCardHalf,
                    selected && styles.priceCardSelected,
                  ]}
                  onPress={() => updatePendingVehicle(vehicle.type)}
                >
                  <View style={styles.priceCardHeader}>
                    <Text style={styles.priceCardTitle}>{vehicle.title}</Text>
                    {selected ? (
                      <Ionicons name="checkmark-circle" size={22} color={colors.gold} />
                    ) : null}
                  </View>
                  {vehicle.lines.map((line) => (
                    <Text key={line} style={styles.priceLine}>
                      • {line}
                    </Text>
                  ))}
                  {pendingBooking.distanceMiles > 0 ? (
                    <Text style={styles.previewFare}>
                      Preview: {formatGBP(previewFare)}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.bottomSection, isWide && styles.bottomSectionWide]}>
            <View style={[styles.bottomBlock, isWide && styles.bottomBlockWide]}>
              <Text style={styles.sectionTitle}>DISTANCE (MILES)</Text>
              <FormInput
                scale={scale}
                icon="speedometer-outline"
                placeholder="Enter journey distance in miles"
                value={milesText}
                onChangeText={handleMilesChange}
                keyboardType="decimal-pad"
                onFocus={() => {
                  if (!isWide) {
                    setTimeout(() => {
                      scrollRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                  }
                }}
              />
              <Text style={[styles.hint, isWide && styles.hintWide]}>
                Enter the total miles for your journey. The fare updates automatically.
              </Text>
            </View>

            <View style={[styles.bottomBlock, isWide && styles.bottomBlockWide]}>
              <View style={styles.totalCard}>
                <Text style={styles.totalLabel}>ESTIMATED TOTAL</Text>
                <Text style={[styles.totalAmount, { fontSize: Math.round(36 * scale) }]}>
                  {formatGBP(pendingBooking.estimatedFare)}
                </Text>
                <Text style={styles.totalMeta}>
                  {VEHICLES.find((v) => v.type === pendingBooking.vehicleType)?.title} ·{' '}
                  {pendingBooking.distanceMiles} mile
                  {pendingBooking.distanceMiles === 1 ? '' : 's'}
                </Text>
              </View>

              <GoldButton
                label="REVIEW BOOKING DETAILS"
                icon="document-text-outline"
                scale={scale}
                style={styles.confirmButton}
                onPress={goToReview}
              />
            </View>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    width: '100%',
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
  journeyCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundPanel,
  },
  cardLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  journeyLine: {
    color: colors.text,
    marginBottom: 4,
  },
  customerLine: {
    color: colors.textMuted,
    marginTop: 8,
    fontSize: 13,
  },
  sectionTitle: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  pricingGrid: {
    marginBottom: spacing.lg,
  },
  pricingGridThreeCol: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  pricingGridTwoCol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
  },
  priceCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.inputBg,
  },
  priceCardCol: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
  },
  priceCardHalf: {
    width: '48%',
    minWidth: 200,
    flexGrow: 1,
  },
  priceCardSelected: {
    borderColor: colors.goldLight,
    backgroundColor: colors.backgroundPanel,
  },
  priceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceCardTitle: {
    color: colors.goldLight,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  priceLine: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  previewFare: {
    color: colors.gold,
    fontWeight: '600',
    marginTop: 8,
  },
  bottomSection: {
    width: '100%',
  },
  bottomSectionWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  bottomBlock: {
    width: '100%',
  },
  bottomBlockWide: {
    flex: 1,
    minWidth: 0,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.lg,
    lineHeight: 18,
  },
  hintWide: {
    marginBottom: 0,
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
  totalMeta: {
    color: colors.textMuted,
    marginTop: 8,
    fontSize: 13,
  },
  confirmButton: {
    alignSelf: 'stretch',
    marginBottom: spacing.md,
  },
});
