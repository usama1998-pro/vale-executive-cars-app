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
};

type PickerMode = 'date' | 'time' | null;

export default function PreferredPickupPicker({
  value,
  onChange,
  scale = 1,
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

  const clearSelection = () => {
    onChange('');
    setPickerMode(null);
  };

  const iconSize = Math.round(18 * scale);
  const fontSize = Math.round(14 * scale);
  const labelSize = Math.round(11 * scale);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Ionicons name="time-outline" size={iconSize} color={colors.gold} />
        <Text style={[styles.label, { fontSize: labelSize }]}>
          PREFERRED PICKUP (OPTIONAL)
        </Text>
      </View>

      <View style={styles.row}>
        <Pressable
          style={[styles.selector, { minHeight: Math.round(44 * scale) }]}
          onPress={() => openPicker('date')}
        >
          <Ionicons name="calendar-outline" size={iconSize} color={colors.gold} />
          <Text style={[styles.selectorText, { fontSize }]}>
            {formatPickupDate(value)}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.selector, { minHeight: Math.round(44 * scale) }]}
          onPress={() => openPicker('time')}
        >
          <Ionicons name="time-outline" size={iconSize} color={colors.gold} />
          <Text style={[styles.selectorText, { fontSize }]}>
            {formatPickupTime(value)}
          </Text>
        </Pressable>
      </View>

      {value ? (
        <Pressable onPress={clearSelection} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear selection</Text>
        </Pressable>
      ) : null}

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
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
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
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  selectorText: {
    flex: 1,
    color: colors.text,
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 4,
  },
  clearText: {
    color: colors.textMuted,
    fontSize: 12,
    textDecorationLine: 'underline',
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
