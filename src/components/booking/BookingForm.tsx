import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useBooking } from '../../context/BookingContext';
import { colors, radius, spacing } from '../../theme';
import FormInput from './FormInput';
import GoldButton from './GoldButton';
import PreferredPickupPicker from './PreferredPickupPicker';

type BookingFormProps = {
  scale: number;
  compact?: boolean;
};

export default function BookingForm({ scale, compact = false }: BookingFormProps) {
  const { form, updateForm, goToEstimate } = useBooking();

  const headingSize = Math.round((compact ? 14 : 20) * scale);
  const subSize = Math.round((compact ? 9 : 11) * scale);
  const sectionSize = Math.round((compact ? 10 : 12) * scale);
  const panelPadding = compact ? spacing.sm : spacing.lg;

  return (
    <View style={[styles.panel, compact && styles.panelCompact, { padding: panelPadding }]}>
      <Text style={[styles.heading, { fontSize: headingSize }]}>BOOK YOUR EXECUTIVE TAXI</Text>
      <Text
        style={[
          styles.subheading,
          compact && styles.subheadingCompact,
          { fontSize: subSize },
        ]}
      >
        QUICK. EASY. RELIABLE.
      </Text>

      <View style={styles.sectionHeader}>
        <Ionicons name="person-outline" size={16 * scale} color={colors.gold} />
        <Text style={[styles.sectionTitle, { fontSize: sectionSize }]}>CUSTOMER DETAILS</Text>
      </View>

      <FormInput
        scale={scale}
        icon="person-outline"
        placeholder="Customer Name"
        value={form.customerName}
        onChangeText={(customerName) => updateForm({ customerName })}
      />
      <FormInput
        scale={scale}
        icon="call-outline"
        trailingIcon="logo-whatsapp"
        placeholder="Customer Contact Number"
        value={form.contactNumber}
        onChangeText={(contactNumber) => updateForm({ contactNumber })}
        keyboardType="phone-pad"
      />
      <FormInput
        scale={scale}
        icon="mail-outline"
        placeholder="Customer Email Address"
        value={form.email}
        onChangeText={(email) => updateForm({ email })}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={[styles.sectionHeader, { marginTop: spacing.sm }]}>
        <Ionicons name="location-outline" size={16 * scale} color={colors.gold} />
        <Text style={[styles.sectionTitle, { fontSize: sectionSize }]}>JOURNEY DETAILS</Text>
      </View>

      <FormInput
        scale={scale}
        icon="location-outline"
        placeholder="From"
        value={form.from}
        onChangeText={(from) => updateForm({ from })}
      />
      <FormInput
        scale={scale}
        icon="location-outline"
        placeholder="Via (optional)"
        value={form.via}
        onChangeText={(via) => updateForm({ via })}
      />
      <FormInput
        scale={scale}
        icon="location-outline"
        placeholder="To"
        value={form.to}
        onChangeText={(to) => updateForm({ to })}
      />

      <PreferredPickupPicker
        scale={scale}
        value={form.preferredPickupAt}
        onChange={(preferredPickupAt) => updateForm({ preferredPickupAt })}
      />

      <GoldButton
        label="GET ESTIMATE"
        icon="car-sport-outline"
        scale={scale}
        style={styles.submitButton}
        onPress={goToEstimate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    minWidth: 280,
    zIndex: 2,
    backgroundColor: colors.backgroundPanel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  panelCompact: {
    minWidth: 0,
    justifyContent: 'space-between',
  },
  subheadingCompact: {
    marginBottom: spacing.sm,
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
});
