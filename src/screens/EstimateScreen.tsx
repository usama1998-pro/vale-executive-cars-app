import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EstimateLoader from '../components/booking/EstimateLoader';
import GoldButton from '../components/booking/GoldButton';
import Screen from '../components/Screen';
import { VEHICLE_IMAGES } from '../constants/vehicleImages';
import { useBooking } from '../context/BookingContext';
import { useKeyboardPadding } from '../hooks/useKeyboardPadding';
import { useResponsive } from '../hooks/useResponsive';
import { VehicleType } from '../types/booking';
import { colors, radius, spacing } from '../theme';
import { formatGBP, PRICING } from '../utils/pricing';

const VEHICLES: {
  type: VehicleType;
  title: string;
  tagline: string;
  lines: string[];
  image: ImageSourcePropType;
  recommended?: boolean;
}[] = [
  {
    type: 'saloon',
    title: PRICING.saloon.label,
    tagline: 'Comfortable everyday travel',
    image: VEHICLE_IMAGES.saloon,
    lines: [
      'First 3 miles charged at £5 per mile',
      'Any additional miles charged at £3 per mile',
    ],
  },
  {
    type: 'executive',
    title: PRICING.executive.label,
    tagline: 'Premium ride, business class',
    image: VEHICLE_IMAGES.executive,
    lines: ['Charged at £5 per mile'],
    recommended: true,
  },
  {
    type: 'mpv',
    title: PRICING.mpv.label,
    tagline: 'Extra space for groups & luggage',
    image: VEHICLE_IMAGES.mpv,
    lines: ['Charged at 1.5× the Executive rate'],
  },
];

function formatDuration(minutes?: number): string | null {
  if (!minutes || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}

export default function EstimateScreen() {
  const {
    pendingBooking,
    goHome,
    updatePendingVehicle,
    goToReview,
    isCalculatingQuote,
    quoteFares,
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

  if (!pendingBooking) {
    return null;
  }

  const quoteReady = !isCalculatingQuote && pendingBooking.distanceKm > 0;
  const durationLabel = formatDuration(pendingBooking.durationMinutes);
  const selectedVehicle = VEHICLES.find((v) => v.type === pendingBooking.vehicleType);

  return (
    <Screen style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
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
        <View
          style={[
            styles.page,
            { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
          ]}
        >
          <Pressable style={styles.backRow} onPress={goHome} disabled={isCalculatingQuote}>
            <Ionicons name="arrow-back" size={20} color={colors.gold} />
            <Text style={styles.backText}>Back to booking</Text>
          </Pressable>

          <Text style={[styles.title, { fontSize: Math.round(22 * scale) }]}>
            ESTIMATED COST
          </Text>
          <Text style={styles.subtitle}>
            {isCalculatingQuote
              ? 'Calculating your route and fare…'
              : 'Choose the service that suits your journey.'}
          </Text>

          <View style={styles.journeyCard}>
            <View style={styles.journeyRow}>
              <View style={styles.journeyDotFrom} />
              <Text style={styles.journeyText} numberOfLines={1}>
                {pendingBooking.from}
              </Text>
            </View>
            <View style={styles.journeyConnector} />
            <View style={styles.journeyRow}>
              <Ionicons name="location" size={14} color={colors.gold} />
              <Text style={styles.journeyText} numberOfLines={1}>
                {pendingBooking.to}
              </Text>
            </View>
          </View>

          {isCalculatingQuote ? <EstimateLoader scale={scale} /> : null}

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>SELECT YOUR SERVICE</Text>
            {quoteReady ? (
              <View style={styles.distanceChip}>
                <Ionicons name="speedometer-outline" size={13} color={colors.gold} />
                <Text style={styles.distanceChipText}>
                  {pendingBooking.distanceKm} km
                  {durationLabel ? ` · ${durationLabel}` : ''}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={[
              styles.pricingGrid,
              isWide && styles.pricingGridThreeCol,
              isTablet && !isWide && styles.pricingGridTwoCol,
              { gap: columnGap },
            ]}
          >
            {isCalculatingQuote
              ? VEHICLES.map((vehicle) => (
                  <View
                    key={vehicle.type}
                    style={[
                      styles.priceCard,
                      styles.skeletonCard,
                      isWide && styles.priceCardCol,
                      isTablet && !isWide && styles.priceCardHalf,
                    ]}
                  >
                    <View style={[styles.skeletonBlock, styles.skeletonImage]} />
                    <View style={[styles.skeletonBlock, styles.skeletonTitle]} />
                    <View style={[styles.skeletonBlock, styles.skeletonLine]} />
                    <View
                      style={[styles.skeletonBlock, styles.skeletonLine, { width: '60%' }]}
                    />
                  </View>
                ))
              : VEHICLES.map((vehicle) => {
                  const selected = pendingBooking.vehicleType === vehicle.type;
                  const previewFare = quoteFares ? quoteFares[vehicle.type] : 0;
                  const imageHeight = Math.round((isWide ? 130 : 150) * scale);
                  return (
                    <Pressable
                      key={vehicle.type}
                      style={({ pressed }) => [
                        styles.priceCard,
                        isWide && styles.priceCardCol,
                        isTablet && !isWide && styles.priceCardHalf,
                        selected && styles.priceCardSelected,
                        pressed && styles.priceCardPressed,
                      ]}
                      onPress={() => updatePendingVehicle(vehicle.type)}
                    >
                      {vehicle.recommended ? (
                        <View style={styles.popularBadge}>
                          <Ionicons name="star" size={11} color={colors.buttonText} />
                          <Text style={styles.popularBadgeText}>POPULAR</Text>
                        </View>
                      ) : null}

                      <View
                        style={[styles.radio, selected && styles.radioSelected]}
                      >
                        {selected ? (
                          <Ionicons name="checkmark" size={14} color={colors.buttonText} />
                        ) : null}
                      </View>

                      <Image
                        source={vehicle.image}
                        style={[styles.vehicleImage, { height: imageHeight }]}
                        resizeMode="contain"
                        accessibilityLabel={`${vehicle.title} vehicle`}
                      />

                      <Text style={styles.priceCardTitle}>{vehicle.title}</Text>
                      <Text style={styles.priceCardTagline}>{vehicle.tagline}</Text>

                      <View style={styles.priceLinesWrap}>
                        {vehicle.lines.map((line) => (
                          <View key={line} style={styles.priceLineRow}>
                            <Ionicons
                              name="checkmark-circle"
                              size={14}
                              color={colors.gold}
                            />
                            <Text style={styles.priceLine}>{line}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={[styles.farePill, selected && styles.farePillSelected]}>
                        <Text
                          style={[
                            styles.farePillLabel,
                            selected && styles.farePillTextSelected,
                          ]}
                        >
                          FARE
                        </Text>
                        <Text
                          style={[
                            styles.farePillValue,
                            selected && styles.farePillTextSelected,
                          ]}
                        >
                          {formatGBP(previewFare)}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
          </View>

          <View style={styles.totalCard}>
            <View style={styles.totalLeft}>
              <Text style={styles.totalLabel}>ESTIMATED TOTAL</Text>
              <Text style={styles.totalMeta}>
                {selectedVehicle?.title}
                {quoteReady ? ` · ${pendingBooking.distanceKm} km` : ''}
              </Text>
            </View>
            <Text style={[styles.totalAmount, { fontSize: Math.round(34 * scale) }]}>
              {quoteReady ? formatGBP(pendingBooking.estimatedFare) : '—'}
            </Text>
          </View>

          <GoldButton
            label={isCalculatingQuote ? 'CALCULATING…' : 'REVIEW BOOKING DETAILS'}
            icon="document-text-outline"
            scale={scale}
            style={styles.confirmButton}
            onPress={goToReview}
            disabled={!quoteReady}
            loading={isCalculatingQuote}
          />
          <Text style={styles.footnote}>
            Distance is calculated automatically from your pickup and drop-off addresses.
          </Text>
        </View>
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
    opacity: 0.85,
  },
  journeyCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundPanel,
  },
  journeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  journeyDotFrom: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.gold,
    marginLeft: 1,
  },
  journeyConnector: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 7,
    marginVertical: 3,
    opacity: 0.6,
  },
  journeyText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  distanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  distanceChipText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '600',
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
    borderRadius: radius.md,
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
    borderWidth: 2,
    backgroundColor: colors.backgroundPanel,
  },
  priceCardPressed: {
    opacity: 0.85,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.gold,
    borderRadius: radius.full,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  popularBadgeText: {
    color: colors.buttonText,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  radio: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  vehicleImage: {
    width: '100%',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  priceCardTitle: {
    color: colors.goldLight,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  priceCardTagline: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
    marginBottom: spacing.sm,
    opacity: 0.8,
  },
  priceLinesWrap: {
    gap: 4,
    marginBottom: spacing.md,
  },
  priceLineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  priceLine: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  farePill: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  farePillSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  farePillLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  farePillValue: {
    color: colors.goldLight,
    fontSize: 18,
    fontWeight: '800',
  },
  farePillTextSelected: {
    color: colors.buttonText,
  },
  skeletonCard: {
    minHeight: 320,
  },
  skeletonBlock: {
    backgroundColor: colors.gold,
    opacity: 0.12,
    borderRadius: radius.sm,
  },
  skeletonImage: {
    width: '100%',
    height: 130,
    marginBottom: spacing.md,
  },
  skeletonTitle: {
    width: '55%',
    height: 18,
    marginBottom: spacing.sm,
  },
  skeletonLine: {
    width: '85%',
    height: 12,
    marginBottom: spacing.sm,
  },
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundPanel,
  },
  totalLeft: {
    flex: 1,
    paddingRight: spacing.md,
  },
  totalLabel: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1.5,
    fontSize: 12,
  },
  totalMeta: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 13,
    opacity: 0.85,
  },
  totalAmount: {
    color: colors.goldLight,
    fontWeight: '800',
  },
  confirmButton: {
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  footnote: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
    marginBottom: spacing.md,
  },
});
