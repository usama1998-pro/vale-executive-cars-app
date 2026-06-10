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
  const imageHeight = Math.round((compact ? 188 : isWide ? 170 : 180) * scale);
  const titleSize = Math.round((compact ? 28 : 22) * scale);
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
                  compact && { height: imageHeight },
                ]}
              />
              <View style={[styles.skeletonBlock, styles.skeletonTitle]} />
              <View style={[styles.skeletonBlock, styles.skeletonLine]} />
            </View>
            <View style={[styles.skeletonBlock, styles.skeletonFare]} />
          </View>
        ))
      : VEHICLES.map((vehicle) => {
          const selected = pendingBooking.vehicleType === vehicle.type;
          const previewFare = quoteFares ? quoteFares[vehicle.type] : 0;
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

                <Text style={[styles.priceCardTitle, compact && styles.priceCardTitleCompact]}>
                  {vehicle.title}
                </Text>
                <Text style={[styles.priceCardTagline, compact && styles.priceCardTaglineCompact]}>
                  {vehicle.tagline}
                </Text>

                <View style={[styles.priceLinesWrap, compact && styles.priceLinesWrapCompact]}>
                  {vehicle.lines.map((line) => (
                    <View key={line} style={styles.priceLineRow}>
                      <Ionicons name="checkmark-circle" size={compact ? 15 : 14} color={colors.gold} />
                      <Text
                        style={[styles.priceLine, compact && styles.priceLineCompact]}
                      >
                        {line}
                      </Text>
                    </View>
                  ))}
                </View>
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
      <Pressable style={styles.backRow} onPress={goHome} disabled={isCalculatingQuote}>
        <Ionicons name="arrow-back" size={compact ? 18 : 20} color={colors.gold} />
        {!compact ? <Text style={styles.backText}>Back to booking</Text> : null}
      </Pressable>

      <View style={[styles.titleSection, compact && styles.titleSectionCompact]}>
        <Text style={[styles.title, { fontSize: titleSize }]}>ESTIMATED COST</Text>
        {!compact ? (
          <Text style={styles.subtitle}>
            {isCalculatingQuote
              ? 'Calculating your route and fare…'
              : 'Choose the service that suits your journey.'}
          </Text>
        ) : null}
      </View>

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
          <Text style={styles.sectionTitle}>SELECT YOUR SERVICE</Text>
        </View>
      ) : null}

      <View
        style={[
          compact ? styles.cardsAndFooter : undefined,
          compact && styles.cardsAndFooterRaised,
        ]}
      >
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
                {selectedVehicle?.title}
              </Text>
            </View>
            <Text style={[styles.totalAmount, { fontSize: Math.round((compact ? 26 : 34) * scale) }]}>
              {quoteReady ? formatGBP(pendingBooking.estimatedFare) : '—'}
            </Text>
          </View>

          <GoldButton
            label={isCalculatingQuote ? 'CALCULATING…' : compact ? 'REVIEW DETAILS' : 'REVIEW BOOKING DETAILS'}
            icon="document-text-outline"
            scale={compact ? scale * 0.88 : scale}
            style={[styles.confirmButton, compact && styles.confirmButtonCompact]}
            onPress={goToReview}
            disabled={!quoteReady}
            loading={isCalculatingQuote}
          />
        </View>
      </View>

      {!compact ? (
        <Text style={styles.footnote}>
          Distance is calculated automatically from your pickup and drop-off addresses.
        </Text>
      ) : null}
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
  cardsAndFooter: {
    flex: 1,
    minHeight: 0,
    justifyContent: 'flex-start',
  },
  cardsAndFooterRaised: {
    marginTop: -spacing.sm,
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
  titleSection: {
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleSectionCompact: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    paddingBottom: spacing.xs,
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
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    minHeight: 390,
    backgroundColor: colors.inputBg,
  },
  priceCardColumn: {
    flexDirection: 'column',
  },
  priceCardCompact: {
    flex: 1,
    alignSelf: 'stretch',
    minWidth: 0,
    minHeight: 460,
    marginBottom: 0,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  priceCardContent: {
    flex: 1,
    minHeight: 0,
    width: '100%',
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
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  vehicleImageCompact: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    width: '100%',
  },
  priceCardTitle: {
    color: colors.goldLight,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  priceCardTitleCompact: {
    fontSize: 19,
    textAlign: 'center',
  },
  priceCardTagline: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
    marginBottom: spacing.sm,
    opacity: 0.8,
  },
  priceCardTaglineCompact: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  priceLinesWrap: {
    gap: 4,
    marginBottom: spacing.sm,
  },
  priceLinesWrapCompact: {
    flex: 1,
    marginBottom: spacing.xs,
    width: '100%',
    gap: 6,
  },
  priceLineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  priceLine: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  priceLineCompact: {
    fontSize: 14,
    lineHeight: 21,
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
  farePillCompact: {
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    minHeight: 390,
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
  skeletonFare: {
    width: '100%',
    height: 44,
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
  confirmButton: {
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  confirmButtonCompact: {
    flex: 1,
    minWidth: 180,
    marginBottom: 0,
    alignSelf: 'stretch',
    justifyContent: 'center',
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
