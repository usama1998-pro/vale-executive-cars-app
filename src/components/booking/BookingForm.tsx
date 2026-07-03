import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBooking } from '../../context/BookingContext';
import { MAX_BOOKING_NOTE_LENGTH } from '../../types/booking';
import { colors, radius, spacing } from '../../theme';
import { getCurrentLocationAddress } from '../../utils/location';
import { sanitizePassengerInput } from '../../utils/passengers';
import FormInput from './FormInput';
import GoldButton from './GoldButton';
import LocationAutocompleteInput from './LocationAutocompleteInput';
import PreferredPickupPicker from './PreferredPickupPicker';

type BookingFormProps = {
  scale: number;
  compact?: boolean;
  dense?: boolean;
  fill?: boolean;
  isWeb?: boolean;
  keyboardInset?: number;
};

export default function BookingForm({
  scale,
  compact = false,
  dense = false,
  fill = false,
  isWeb = false,
  keyboardInset = 0,
}: BookingFormProps) {
  const { form, updateForm, goToEstimate, isCalculatingQuote } = useBooking();
  const [isLocatingPickup, setIsLocatingPickup] = useState(false);

  const fillPickupWithCurrentLocation = useCallback(async () => {
    setIsLocatingPickup(true);
    try {
      const address = await getCurrentLocationAddress();
      if (address) {
        updateForm({ from: address });
      } else {
        Alert.alert(
          'Location unavailable',
          'Allow location access or enter your pickup address manually.',
        );
      }
    } catch {
      Alert.alert(
        'Location error',
        'Could not get your current location. Please enter your pickup address manually.',
      );
    } finally {
      setIsLocatingPickup(false);
    }
  }, [updateForm]);

  const webFit = isWeb && fill;
  const tight = compact || dense || webFit;
  const sectionSize = Math.round(
    (dense ? 13 : compact ? 15 : isWeb ? 16 : 15) * scale,
  );
  const panelPaddingVertical = dense
    ? spacing.xs
    : webFit
      ? Math.round(8 * scale)
      : spacing.sm;
  const panelPaddingHorizontal = dense
    ? spacing.sm
    : webFit
      ? Math.round(20 * scale)
      : compact
        ? spacing.lg
        : spacing.lg;
  const inputGap = webFit
    ? Math.round(3 * scale)
    : dense
      ? Math.round(1 * scale)
      : 4;

  const formContent = (
    <>
      <View style={[styles.tripTypeWrap, { marginBottom: inputGap }]}>
        <View style={[styles.labelRow, dense && styles.labelRowDense]}>
          <Ionicons name="swap-horizontal-outline" size={20 * scale} color={colors.gold} />
          <Text style={[styles.sectionTitle, { fontSize: sectionSize }]}>TRIP TYPE</Text>
        </View>
        <View style={[styles.tripTypeRow, { gap: rowGapByScale(scale, tight) }]}>
          <Pressable
            style={[
              styles.tripTypeOption,
              form.tripType === 'one-way' && styles.tripTypeOptionActive,
            ]}
            onPress={() => updateForm({ tripType: 'one-way', returnPickupAt: '' })}
          >
            <Text
              style={[
                styles.tripTypeText,
                form.tripType === 'one-way' && styles.tripTypeTextActive,
              ]}
            >
              ONE WAY
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tripTypeOption,
              form.tripType === 'return' && styles.tripTypeOptionActive,
            ]}
            onPress={() => updateForm({ tripType: 'return' })}
          >
            <Text
              style={[
                styles.tripTypeText,
                form.tripType === 'return' && styles.tripTypeTextActive,
              ]}
            >
              RETURN
            </Text>
          </Pressable>
        </View>
      </View>

      <View
        style={[
          styles.sectionHeader,
          tight && { marginBottom: 2 },
        ]}
      >
        <Ionicons
          name="person-outline"
          size={20 * scale}
          color={colors.gold}
        />
        <Text style={[styles.sectionTitle, { fontSize: sectionSize }]}>
          CUSTOMER DETAILS
        </Text>
      </View>

      <FormInput
        scale={scale}
        dense={dense}
        webFit={webFit}
        inputGap={inputGap}
        icon="person-outline"
        placeholder="Customer Name"
        value={form.customerName}
        onChangeText={(customerName) => updateForm({ customerName })}
      />
      <FormInput
        scale={scale}
        dense={dense}
        webFit={webFit}
        inputGap={inputGap}
        icon="call-outline"
        trailingIcon="logo-whatsapp"
        trailingIconColor={colors.whatsapp}
        placeholder="Customer Contact Number"
        value={form.contactNumber}
        onChangeText={(contactNumber) => updateForm({ contactNumber })}
        keyboardType="phone-pad"
      />
      <FormInput
        scale={scale}
        dense={dense}
        webFit={webFit}
        inputGap={inputGap}
        icon="mail-outline"
        placeholder="Customer Email Address"
        value={form.email}
        onChangeText={(email) => updateForm({ email })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={[styles.fieldRow, { gap: inputGap, marginBottom: inputGap }]}>
        <View style={styles.fieldRowItem}>
          <FormInput
            scale={scale}
            dense={dense}
            webFit={webFit}
            inputGap={0}
            icon="people-outline"
            placeholder="Passengers (max 8)"
            value={form.passengers}
            onChangeText={(passengers) =>
              updateForm({ passengers: sanitizePassengerInput(passengers) })
            }
            keyboardType="number-pad"
            maxLength={1}
          />
        </View>
        <View style={styles.fieldRowItem}>
          <FormInput
            scale={scale}
            dense={dense}
            webFit={webFit}
            inputGap={0}
            icon="bed-outline"
            placeholder="Room no. (optional)"
            value={form.roomNo}
            onChangeText={(roomNo) => updateForm({ roomNo })}
          />
        </View>
      </View>

      <View
        style={[
          styles.sectionHeader,
          tight
            ? { marginBottom: 2, marginTop: 2 }
            : { marginTop: 4 },
        ]}
      >
        <Ionicons
          name="location-outline"
          size={20 * scale}
          color={colors.gold}
        />
        <Text style={[styles.sectionTitle, { fontSize: sectionSize }]}>
          JOURNEY DETAILS
        </Text>
      </View>

      <LocationAutocompleteInput
        scale={scale}
        dense={dense}
        webFit={webFit}
        inputGap={inputGap}
        icon="location-outline"
        trailingIcon={isLocatingPickup ? 'hourglass-outline' : 'navigate-outline'}
        onTrailingPress={isLocatingPickup ? undefined : fillPickupWithCurrentLocation}
        placeholder="Pickup"
        value={form.from}
        onChangeText={(from) => updateForm({ from })}
        editable={!isLocatingPickup}
      />
      <LocationAutocompleteInput
        scale={scale}
        dense={dense}
        webFit={webFit}
        inputGap={inputGap}
        icon="location-outline"
        placeholder="To"
        value={form.to}
        onChangeText={(to) => updateForm({ to })}
      />

      <PreferredPickupPicker
        scale={scale}
        dense={dense}
        webFit={webFit}
        inputGap={inputGap}
        value={form.preferredPickupAt}
        onChange={(preferredPickupAt) => updateForm({ preferredPickupAt })}
      />

      {form.tripType === 'return' ? (
        <PreferredPickupPicker
          scale={scale}
          dense={dense}
          webFit={webFit}
          inputGap={inputGap}
          value={form.returnPickupAt}
          label="RETURN PICKUP (OPTIONAL)"
          onChange={(returnPickupAt) => updateForm({ returnPickupAt })}
        />
      ) : null}

      <FormInput
        scale={scale}
        dense={dense}
        webFit={webFit}
        inputGap={inputGap}
        icon="document-text-outline"
        placeholder="Note (optional, max 250 chars)"
        value={form.note}
        onChangeText={(note) =>
          updateForm({ note: note.slice(0, MAX_BOOKING_NOTE_LENGTH) })
        }
        maxLength={MAX_BOOKING_NOTE_LENGTH}
        multiline
        displayLines={1}
        autoCapitalize="sentences"
      />

      <GoldButton
        label={isCalculatingQuote ? 'CALCULATING…' : 'GET ESTIMATE'}
        icon="car-sport-outline"
        scale={scale}
        style={tight ? styles.submitButtonTight : styles.submitButton}
        onPress={goToEstimate}
        loading={isCalculatingQuote}
        disabled={isCalculatingQuote}
      />
    </>
  );

  if (fill) {
    const keyboardOpen = keyboardInset > 0;
    return (
      <View
        style={[
          styles.panel,
          styles.panelFill,
          {
            paddingVertical: panelPaddingVertical,
            paddingHorizontal: panelPaddingHorizontal,
            overflow: 'hidden',
          },
        ]}
      >
        <ScrollView
          style={styles.innerScroll}
          contentContainerStyle={[
            styles.innerScrollContent,
            !keyboardOpen && styles.innerScrollContentDistributed,
            keyboardOpen && { paddingBottom: keyboardInset },
          ]}
          scrollEnabled={keyboardOpen || !webFit}
          showsVerticalScrollIndicator={keyboardOpen}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          nestedScrollEnabled
        >
          {formContent}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.panel,
        fill && styles.panelFill,
        compact && styles.panelCompact,
        dense && styles.panelDense,
        {
          paddingVertical: panelPaddingVertical,
          paddingHorizontal: panelPaddingHorizontal,
        },
      ]}
    >
      {formContent}
    </View>
  );
}

function rowGapByScale(scale: number, tight: boolean) {
  return Math.round((tight ? 8 : 10) * scale);
}

const styles = StyleSheet.create({
  panel: {
    minWidth: 280,
    zIndex: 2,
    backgroundColor: colors.backgroundPanel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  panelFill: {
    flex: 1,
    minHeight: 0,
  },
  panelCompact: {
    minWidth: 0,
    justifyContent: 'space-between',
  },
  panelDense: {
    minWidth: 0,
    justifyContent: 'space-between',
  },
  innerScroll: {
    flex: 1,
  },
  innerScrollContent: {
    flexGrow: 1,
  },
  innerScrollContentDistributed: {
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  fieldRowItem: {
    flex: 1,
    minWidth: 0,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  labelRowDense: {
    marginBottom: 2,
    gap: 4,
  },
  tripTypeWrap: {
    marginBottom: 4,
  },
  tripTypeRow: {
    flexDirection: 'row',
  },
  tripTypeOption: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  tripTypeOptionActive: {
    borderColor: colors.buttonGold,
    backgroundColor: colors.buttonGold,
  },
  tripTypeText: {
    color: colors.gold,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.75,
  },
  tripTypeTextActive: {
    color: colors.buttonText,
    fontWeight: '800',
    opacity: 1,
  },
  submitButton: {
    marginBottom: spacing.md,
    alignSelf: 'stretch',
  },
  submitButtonTight: {
    marginBottom: spacing.sm,
    alignSelf: 'stretch',
  },
});
