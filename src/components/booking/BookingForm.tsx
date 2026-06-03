import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBooking } from '../../context/BookingContext';
import { colors, radius, spacing } from '../../theme';
import { getCurrentLocationAddress } from '../../utils/location';
import FormInput from './FormInput';
import GoldButton from './GoldButton';
import PreferredPickupPicker from './PreferredPickupPicker';

type BookingFormProps = {
  scale: number;
  compact?: boolean;
  dense?: boolean;
  fill?: boolean;
  isWeb?: boolean;
};

export default function BookingForm({
  scale,
  compact = false,
  dense = false,
  fill = false,
  isWeb = false,
}: BookingFormProps) {
  const { form, updateForm, goToEstimate } = useBooking();
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
  const headingSize = Math.round(
    (dense ? 14 : compact ? 14 : isWeb ? 22 : 20) * scale,
  );
  const subSize = Math.round(
    (dense ? 9 : compact ? 9 : isWeb ? 12 : 11) * scale,
  );
  const sectionSize = Math.round(
    (dense ? 10 : compact ? 10 : isWeb ? 13 : 12) * scale,
  );
  const panelPadding = dense
    ? spacing.xs
    : webFit
      ? Math.round(12 * scale)
      : compact
        ? spacing.sm
        : spacing.lg;
  const inputGap = webFit
    ? Math.round(6 * scale)
    : dense
      ? Math.round(3 * scale)
      : 10;

  const formContent = (
    <>
      <Text style={[styles.heading, { fontSize: headingSize }]}>
        BOOK YOUR EXECUTIVE TAXI
      </Text>
      <Text
        style={[
          styles.subheading,
          tight && styles.subheadingCompact,
          dense && styles.subheadingDense,
          { fontSize: subSize },
        ]}
      >
        QUICK. EASY. RELIABLE.
      </Text>

      <View
        style={[
          styles.sectionHeader,
          tight && { marginBottom: spacing.xs },
        ]}
      >
        <Ionicons
          name="person-outline"
          size={16 * scale}
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

      <View
        style={[
          styles.sectionHeader,
          tight
            ? { marginBottom: spacing.xs, marginTop: spacing.xs }
            : { marginTop: spacing.sm },
        ]}
      >
        <Ionicons
          name="location-outline"
          size={16 * scale}
          color={colors.gold}
        />
        <Text style={[styles.sectionTitle, { fontSize: sectionSize }]}>
          JOURNEY DETAILS
        </Text>
      </View>

      <FormInput
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
      <FormInput
        scale={scale}
        dense={dense}
        webFit={webFit}
        inputGap={inputGap}
        icon="location-outline"
        placeholder="Via (optional)"
        value={form.via}
        onChangeText={(via) => updateForm({ via })}
      />
      <FormInput
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
        dense={dense || webFit}
        value={form.preferredPickupAt}
        onChange={(preferredPickupAt) => updateForm({ preferredPickupAt })}
      />

      <GoldButton
        label="GET ESTIMATE"
        icon="car-sport-outline"
        scale={scale}
        style={tight ? styles.submitButtonTight : styles.submitButton}
        onPress={goToEstimate}
      />
    </>
  );

  if (webFit) {
    return (
      <View
        style={[
          styles.panel,
          styles.panelFill,
          { padding: panelPadding, overflow: 'hidden' },
        ]}
      >
        <ScrollView
          style={styles.innerScroll}
          contentContainerStyle={styles.innerScrollContent}
          showsVerticalScrollIndicator={false}
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
        { padding: panelPadding },
      ]}
    >
      {formContent}
    </View>
  );
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
    justifyContent: 'space-between',
  },
  subheadingCompact: {
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  subheadingDense: {
    marginBottom: spacing.xs,
  },
  heading: {
    color: colors.goldLight,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  subheading: {
    color: colors.gold,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
  },
  submitButton: {
    marginTop: spacing.md,
    alignSelf: 'stretch',
  },
  submitButtonTight: {
    marginTop: spacing.sm,
    alignSelf: 'stretch',
  },
});
