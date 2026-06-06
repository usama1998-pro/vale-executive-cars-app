import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme';
import {
  formatPickupDate,
  formatPickupTime,
  getDefaultPickupDate,
  mergeDatePart,
  mergeTimePart,
} from '../../utils/dateTime';

type PreferredPickupPickerProps = {
  value: string;
  onChange: (iso: string) => void;
  scale?: number;
  dense?: boolean;
};

type PickerMode = 'date' | 'time' | null;

export default function PreferredPickupPicker({
  value,
  onChange,
  scale = 1,
  dense = false,
}: PreferredPickupPickerProps) {
  const selectedDate = value ? new Date(value) : null;
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [draftDate, setDraftDate] = useState<Date>(selectedDate ?? getDefaultPickupDate());

  const openPicker = (mode: 'date' | 'time') => {
    setDraftDate(selectedDate ?? getDefaultPickupDate());
    setPickerMode(mode);
  };

  const handleChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (event.type === 'dismissed') {
      setPickerMode(null);
      return;
    }

    if (!picked) return;

    const base = selectedDate ?? draftDate;
    const merged =
      pickerMode === 'date' ? mergeDatePart(base, picked) : mergeTimePart(base, picked);
    setDraftDate(merged);
    onChange(merged.toISOString());

    if (Platform.OS === 'android') {
      setPickerMode(null);
    }
  };

  const iconSize = Math.round(22 * scale);
  const fontSize = Math.round(18 * scale);
  const labelSize = Math.round(15 * scale);
  const selectorHeight = Math.round((dense ? 36 : 54) * scale);
  const selectorPaddingHorizontal = Math.round((dense ? 12 : 16) * scale);
  const selectorPaddingVertical = Math.round((dense ? 8 : 11) * scale);

  return (
    <View style={[styles.wrapper, dense && { marginBottom: 2 }]}>
      <View style={[styles.labelRow, dense && styles.labelRowDense]}>
        <Ionicons name="time-outline" size={iconSize} color={colors.gold} />
        <Text style={[styles.label, { fontSize: labelSize }]}>
          PREFERRED PICKUP (OPTIONAL)
        </Text>
      </View>

      <View style={styles.row}>
        <Pressable
          style={[
            styles.selector,
            {
              minHeight: selectorHeight,
              paddingHorizontal: selectorPaddingHorizontal,
              paddingVertical: selectorPaddingVertical,
            },
          ]}
          onPress={() => openPicker('date')}
        >
          <Ionicons name="calendar-outline" size={iconSize} color={colors.gold} />
          <Text style={[styles.selectorText, { fontSize }]}>
            {formatPickupDate(value)}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.selector,
            {
              minHeight: selectorHeight,
              paddingHorizontal: selectorPaddingHorizontal,
              paddingVertical: selectorPaddingVertical,
            },
          ]}
          onPress={() => openPicker('time')}
        >
          <Ionicons name="time-outline" size={iconSize} color={colors.gold} />
          <Text style={[styles.selectorText, { fontSize }]}>
            {formatPickupTime(value)}
          </Text>
        </Pressable>
      </View>

      {pickerMode ? (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={draftDate}
            mode={pickerMode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
            minimumDate={pickerMode === 'date' ? new Date() : undefined}
            themeVariant="dark"
            accentColor={colors.gold}
            textColor={colors.text}
          />
          {Platform.OS === 'ios' ? (
            <Pressable style={styles.doneButton} onPress={() => setPickerMode(null)}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
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
  label: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  selector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBg,
    overflow: 'hidden',
  },
  selectorText: {
    flex: 1,
    color: colors.text,
  },
  pickerContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBg,
    overflow: 'hidden',
  },
  doneButton: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.goldMuted,
  },
  doneText: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
