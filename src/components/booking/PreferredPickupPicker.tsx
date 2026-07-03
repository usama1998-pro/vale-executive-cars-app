import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useCallback, useEffect, useState } from 'react';
import {
  BackHandler,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors, radius, spacing } from '../../theme';
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
  label?: string;
  scale?: number;
  dense?: boolean;
  webFit?: boolean;
  inputGap?: number;
};

type PickerMode = 'date' | 'time' | null;

export default function PreferredPickupPicker({
  value,
  onChange,
  label = 'PREFERRED PICKUP (OPTIONAL)',
  scale = 1,
  dense = false,
  webFit = false,
  inputGap,
}: PreferredPickupPickerProps) {
  const selectedDate = value ? new Date(value) : null;
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [draftDate, setDraftDate] = useState<Date>(selectedDate ?? getDefaultPickupDate());
  const { height: windowHeight } = useWindowDimensions();
  const useNativeAndroidPicker = Platform.OS === 'android';

  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        setDraftDate(parsed);
      }
    }
  }, [value]);

  const openPicker = (mode: 'date' | 'time') => {
    setDraftDate(selectedDate ?? getDefaultPickupDate());
    setPickerMode(mode);
  };

  const closePicker = useCallback(() => {
    setPickerMode(null);
  }, []);

  const commitPicker = useCallback(() => {
    onChange(draftDate.toISOString());
    setPickerMode(null);
  }, [draftDate, onChange]);

  useEffect(() => {
    if (useNativeAndroidPicker || pickerMode === null) {
      return undefined;
    }

    const onBack = () => {
      closePicker();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => subscription.remove();
  }, [closePicker, pickerMode, useNativeAndroidPicker]);

  const mergePicked = useCallback(
    (mode: Exclude<PickerMode, null>, base: Date, picked: Date) =>
      mode === 'date' ? mergeDatePart(base, picked) : mergeTimePart(base, picked),
    [],
  );

  const handleChange = (event: DateTimePickerEvent, picked?: Date) => {
    if (event.type === 'dismissed') {
      closePicker();
      return;
    }

    if (!picked || !pickerMode) return;

    const merged = mergePicked(pickerMode, draftDate, picked);

    if (useNativeAndroidPicker) {
      onChange(merged.toISOString());
      setPickerMode(null);
      return;
    }

    setDraftDate(merged);
  };

  const iconSize = Math.round(18 * scale);
  const fontSize = Math.round((dense ? 15 : 17) * scale);
  const labelSize = Math.round((dense ? 12 : 14) * scale);
  const selectorHeight = Math.round((dense || webFit ? 36 : 44) * scale);
  const selectorPaddingHorizontal = Math.round((dense || webFit ? 10 : 12) * scale);
  const selectorPaddingVertical = Math.round((dense || webFit ? 6 : 8) * scale);
  const pickerHeight = Math.round(180 * scale);
  const gap = inputGap ?? (dense ? Math.round(1 * scale) : 4);
  const rowGap = Math.round((dense || webFit ? 6 : 8) * scale);
  const cardPadding = Math.round(spacing.md * scale);
  const titleSize = Math.round(13 * scale);
  const sheetTop = Math.round(windowHeight * 0.14);
  const pickerTitle = pickerMode === 'date' ? 'SELECT DATE' : 'SELECT TIME';

  return (
    <View style={[styles.wrapper, { marginBottom: gap }]}>
      <View style={[styles.labelRow, dense && styles.labelRowDense]}>
        <Ionicons name="time-outline" size={iconSize} color={colors.gold} />
        <Text style={[styles.label, { fontSize: labelSize }]}>{label}</Text>
      </View>

      <View style={[styles.row, { gap: rowGap }]}>
        <Pressable
          style={[
            styles.selector,
            {
              minHeight: selectorHeight,
              paddingHorizontal: selectorPaddingHorizontal,
              paddingVertical: selectorPaddingVertical,
              borderRadius: Math.round(radius.sm * scale),
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
              borderRadius: Math.round(radius.sm * scale),
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

      {useNativeAndroidPicker && pickerMode ? (
        <DateTimePicker
          value={draftDate}
          mode={pickerMode}
          display="default"
          onChange={handleChange}
          minimumDate={pickerMode === 'date' ? new Date() : undefined}
          is24Hour
        />
      ) : null}

      {!useNativeAndroidPicker ? (
        <Modal
          visible={pickerMode !== null}
          transparent
          animationType="fade"
          onRequestClose={closePicker}
        >
          <View style={styles.backdrop}>
            <Pressable style={StyleSheet.absoluteFillObject} onPress={closePicker} />
            <View style={[styles.sheet, { top: sheetTop, paddingHorizontal: spacing.lg }]}>
              <View style={[styles.card, { padding: cardPadding }]}>
                <Text style={[styles.modalTitle, { fontSize: titleSize }]}>{pickerTitle}</Text>

                <View
                  style={[
                    styles.pickerSurface,
                    {
                      borderRadius: Math.round(radius.sm * scale),
                      minHeight: pickerHeight,
                    },
                  ]}
                >
                  {pickerMode ? (
                    <DateTimePicker
                      value={draftDate}
                      mode={pickerMode}
                      display="spinner"
                      onChange={handleChange}
                      minimumDate={pickerMode === 'date' ? new Date() : undefined}
                      is24Hour
                      style={{
                        height: pickerHeight,
                        width: '100%',
                      }}
                    />
                  ) : null}
                </View>

                <Pressable
                  style={[styles.doneButton, { paddingVertical: Math.round(10 * scale) }]}
                  onPress={commitPicker}
                >
                  <Text style={[styles.doneText, { fontSize: Math.round(14 * scale) }]}>
                    DONE
                  </Text>
                  <Ionicons
                    name="checkmark"
                    size={Math.round(16 * scale)}
                    color={colors.buttonText}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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
    fontWeight: '500',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1, 26, 22, 0.72)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
    flexShrink: 0,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundPanel,
  },
  modalTitle: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    textAlign: 'center',
    flexShrink: 0,
  },
  pickerSurface: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.buttonGold,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
    flexShrink: 0,
  },
  doneText: {
    color: colors.buttonText,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
