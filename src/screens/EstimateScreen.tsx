import { Ionicons } from '@expo/vector-icons';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EstimateLoader from '../components/booking/EstimateLoader';
import GoldButton from '../components/booking/GoldButton';
import JourneyRouteDisplay from '../components/booking/JourneyRouteDisplay';
import Screen from '../components/Screen';
import { VEHICLE_IMAGES } from '../constants/vehicleImages';
import { VEHICLE_OPTIONS } from '../constants/vehicleOptions';
import { useBooking } from '../context/BookingContext';
import { useResponsive } from '../hooks/useResponsive';
import { colors, radius, spacing } from '../theme';
import { formatGBP } from '../utils/pricing';

const VEHICLES = VEHICLE_OPTIONS.map((option) => ({
  ...option,
  image: VEHICLE_IMAGES[option.type],
  recommended: option.type === 'executive',
}));

export default function EstimateScreen() {
  const {
    pendingBooking,
    goHome,
    goHomeAndClearCache,
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
    fitToScreen,
    columnGap,
    maxContentWidth,
  } = useResponsive();

  if (!pendingBooking) {
    return null;
  }

  const compact = fitToScreen;
  const quoteReady = !isCalculatingQuote && pendingBooking.distanceMiles > 0;
  const selectedVehicle = VEHICLES.find((v) => v.type === pendingBooking.vehicleType);
  const tripMultiplier = pendingBooking.tripType === 'return' ? 2 : 1;
  const imageHeight = Math.round((compact ? 190 : isWide ? 175 : 185) * scale);
  const titleSize = Math.round((compact ? 28 : 22) * scale);
  const vehicleTitleSize = Math.round((compact ? (isWide ? 36 : 32) : 24) * scale);
  const backIconSize = Math.round((compact ? 32 : 20) * scale);
  const backHitSize = backIconSize + Math.round(spacing.md * 2);
  const pagePadding = {
    paddingHorizontal: contentPadding,
    paddingTop: screenPaddingTop,
    paddingBottom: screenPaddingBottom,
  };

  const renderVehicleCards = () =>
    isCalculatingQuote
      ? VEHICLES.map((vehicle) => (
          <View
            key={vehicle.type}
            style={[
              styles.priceCard,
              styles.priceCardColumn,
              styles.skeletonCard,
              compact && styles.skeletonCardCompact,
              compact && styles.priceCardCompact,
              isWide && styles.priceCardCol,
              isTablet && !isWide && styles.priceCardHalf,
            ]}
          >
            <View style={styles.priceCardContent}>
              <View
                style={[
                  styles.skeletonBlock,
                  styles.skeletonImage,
                  { height: imageHeight },
                ]}
              />
              <View style={[styles.skeletonBlock, styles.skeletonTitle]} />
            </View>
            <View style={[styles.skeletonBlock, styles.skeletonFare]} />
          </View>
        ))
      : VEHICLES.map((vehicle) => {
          const selected = pendingBooking.vehicleType === vehicle.type;
          const previewFare = quoteFares ? quoteFares[vehicle.type] * tripMultiplier : 0;
          return (
            <Pressable
              key={vehicle.type}
              style={({ pressed }) => [
                styles.priceCard,
                styles.priceCardColumn,
                compact && styles.priceCardCompact,
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

              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected ? (
                  <Ionicons name="checkmark" size={14} color={colors.buttonText} />
                ) : null}
              </View>

              <View style={styles.priceCardContent}>
                <Image
                  source={vehicle.image}
                  style={[
                    styles.vehicleImage,
                    compact && styles.vehicleImageCompact,
                    { height: imageHeight },
                  ]}
                  resizeMode="contain"
                  accessibilityLabel={`${vehicle.title} vehicle`}
                />

                <Text
                  style={[
                    styles.priceCardTitle,
                    compact && styles.priceCardTitleCompact,
                    { fontSize: vehicleTitleSize },
                  ]}
                >
                  {vehicle.title}
                </Text>
                <Text style={[styles.priceCardTagline, compact && styles.priceCardTaglineCompact]}>
                  {vehicle.tagline}
                </Text>
              </View>

              <View style={[styles.farePill, compact && styles.farePillCompact, selected && styles.farePillSelected]}>
                <Text
                  style={[
                    styles.farePillLabel,
                    compact && styles.farePillLabelCompact,
                    selected && styles.farePillTextSelected,
                  ]}
                >
                  FARE
                </Text>
                <Text
                  style={[
                    styles.farePillValue,
                    compact && styles.farePillValueCompact,
                    selected && styles.farePillTextSelected,
                  ]}
                >
                  {formatGBP(previewFare)}
                </Text>
              </View>
            </Pressable>
          );
        });

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
            onPress={goHome}
            disabled={isCalculatingQuote}
            accessibilityRole="button"
            accessibilityLabel="Back to booking"
          >
            <Ionicons name="arrow-back" size={backIconSize} color={colors.gold} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={[styles.title, styles.titleCompactHeader, { fontSize: titleSize }]}>
              ESTIMATED COST
            </Text>
          </View>
          <View style={{ width: backHitSize }} />
        </View>
      ) : (
        <>
          <Pressable style={styles.backRow} onPress={goHome} disabled={isCalculatingQuote}>
            <Ionicons name="arrow-back" size={backIconSize} color={colors.gold} />
            <Text style={styles.backText}>Back to booking</Text>
          </Pressable>

          <View style={styles.titleSection}>
            <Text style={[styles.title, { fontSize: titleSize }]}>ESTIMATED COST</Text>
            <Text style={styles.subtitle}>
              {isCalculatingQuote
                ? 'Calculating your route and fare…'
                : 'Choose the service that suits your journey.'}
            </Text>
          </View>
        </>
      )}

      <View style={compact ? styles.landscapeBody : undefined}>
        <View style={styles.routeWrap}>
          <JourneyRouteDisplay
            from={pendingBooking.from}
            to={pendingBooking.to}
            compact={compact}
            scale={scale}
          />
        </View>

        {isCalculatingQuote && !compact ? <EstimateLoader scale={scale} /> : null}

        {!compact ? (
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>SELECT YOUR VEHICLE</Text>
          </View>
        ) : null}

        <View style={compact ? styles.cardsAndFooter : undefined}>
          <View
            style={[
              styles.pricingGrid,
              compact && styles.pricingGridFit,
              isWide && styles.pricingGridThreeCol,
              compact && isWide && styles.pricingGridThreeColCompact,
              isTablet && !isWide && styles.pricingGridTwoCol,
              { gap: columnGap },
            ]}
          >
            {renderVehicleCards()}
          </View>

          <View style={[styles.footerRow, compact && styles.footerRowCompact]}>
            <View style={[styles.totalCard, compact && styles.totalCardCompact]}>
              <View style={styles.totalLeft}>
                <Text style={[styles.totalLabel, compact && styles.totalLabelCompact]}>
                  ESTIMATED TOTAL
                </Text>
                <Text style={[styles.totalMeta, compact && styles.totalMetaCompact]} numberOfLines={1}>
                  {`${selectedVehicle?.title ?? ''}${pendingBooking.tripType === 'return' ? ' • RETURN TRIP' : ' • ONE WAY'}`}
                </Text>
              </View>
              <Text style={[styles.totalAmount, { fontSize: Math.round((compact ? 26 : 34) * scale) }]}>
                {quoteReady ? formatGBP(pendingBooking.estimatedFare) : '—'}
              </Text>
            </View>

            <View style={compact ? styles.actionsCompact : styles.actions}>
              <GoldButton
                label={isCalculatingQuote ? 'CALCULATING…' : compact ? 'REVIEW DETAILS' : 'REVIEW BOOKING DETAILS'}
                icon="document-text-outline"
                scale={compact ? scale * 0.88 : scale}
                style={[styles.confirmButton, compact && styles.confirmButtonCompact]}
                onPress={goToReview}
                disabled={!quoteReady}
                loading={isCalculatingQuote}
              />

              <GoldButton
                label="CANCEL"
                icon="close"
                variant="outline"
                scale={compact ? scale * 0.88 : scale}
                style={[styles.cancelButton, compact && styles.cancelButtonCompact]}
                onPress={goHomeAndClearCache}
                disabled={isCalculatingQuote}
              />
            </View>
          </View>
        </View>

        {!compact ? (
          <Text style={styles.footnote}>
            Distance is calculated automatically from your pickup and drop-off addresses.
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <Screen style={styles.screen}>
      {compact ? (
        <View style={[styles.pageShell, pagePadding]}>{pageBody}</View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, pagePadding]}
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
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  page: {
    width: '100%',
  },
  pageFit: {
    flex: 1,
    minHeight: 0,
  },
  landscapeBody: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    justifyContent: 'center',
  },
  cardsAndFooter: {
    flexGrow: 0,
    justifyContent: 'flex-start',
  },
  routeWrap: {
    marginBottom: spacing.sm,
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
  titleSection: {
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    marginBottom: spacing.md,
    lineHeight: 20,
    opacity: 0.85,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -spacing.xs,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  pricingGrid: {
    marginBottom: 0,
  },
  pricingGridFit: {
    flexGrow: 0,
    marginBottom: 0,
  },
  pricingGridThreeCol: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  pricingGridThreeColCompact: {
    alignItems: 'stretch',
    width: '100%',
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 320,
    backgroundColor: colors.inputBg,
  },
  priceCardColumn: {
    flexDirection: 'column',
    gap: spacing.lg,
  },
  priceCardCompact: {
    flex: 1,
    alignSelf: 'stretch',
    minWidth: 0,
    minHeight: 380,
    marginBottom: 0,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  priceCardContent: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    paddingBottom: spacing.sm,
  },
  priceCardCol: {
    flex: 1,
    alignSelf: 'stretch',
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
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  vehicleImageCompact: {
    marginTop: 2,
    marginBottom: spacing.xs,
    width: '100%',
  },
  priceCardTitle: {
    color: colors.goldLight,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  priceCardTitleCompact: {
    textAlign: 'center',
  },
  priceCardTagline: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    opacity: 0.8,
  },
  priceCardTaglineCompact: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  farePill: {
    marginTop: 'auto',
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  farePillCompact: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    width: '100%',
  },
  farePillSelected: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  farePillLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  farePillLabelCompact: {
    fontSize: 12,
  },
  farePillValue: {
    color: colors.goldLight,
    fontSize: 22,
    fontWeight: '800',
  },
  farePillValueCompact: {
    fontSize: 20,
  },
  farePillTextSelected: {
    color: colors.buttonText,
  },
  skeletonCard: {
    minHeight: 320,
  },
  skeletonCardCompact: {
    minHeight: 0,
  },
  skeletonBlock: {
    backgroundColor: colors.gold,
    opacity: 0.12,
    borderRadius: radius.sm,
  },
  skeletonImage: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  skeletonTitle: {
    width: '55%',
    height: 18,
    marginBottom: spacing.sm,
  },
  skeletonFare: {
    width: '100%',
    height: 38,
    marginTop: 'auto',
  },
  footerRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  footerRowCompact: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: 0,
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
  totalCardCompact: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
    padding: spacing.sm,
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
  totalLabelCompact: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  totalMeta: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 13,
    opacity: 0.85,
  },
  totalMetaCompact: {
    fontSize: 11,
    marginTop: 2,
  },
  totalAmount: {
    color: colors.goldLight,
    fontWeight: '800',
  },
  actions: {
    width: '100%',
  },
  actionsCompact: {
    flex: 1.25,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
  },
  confirmButton: {
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  confirmButtonCompact: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  cancelButton: {
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  cancelButtonCompact: {
    flex: 1,
    minWidth: 0,
    marginBottom: 0,
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
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
