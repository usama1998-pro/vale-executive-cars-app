import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePlaceSuggestions } from '../../hooks/usePlaceSuggestions';
import { colors, radius } from '../../theme';
import FormInput from './FormInput';

type LocationAutocompleteInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onTrailingPress?: () => void;
  editable?: boolean;
  scale?: number;
  dense?: boolean;
  webFit?: boolean;
  inputGap?: number;
};

function SuggestionList({
  suggestions,
  loading,
  scale,
  onSelect,
}: {
  suggestions: string[];
  loading: boolean;
  scale: number;
  onSelect: (value: string) => void;
}) {
  const fontSize = Math.round(14 * scale);

  if (loading && suggestions.length === 0) {
    return (
      <View style={styles.statusRow}>
        <Text style={[styles.statusText, { fontSize }]}>Searching…</Text>
      </View>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <>
      {suggestions.map((suggestion) => (
        <Pressable
          key={suggestion}
          style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
          onPress={() => onSelect(suggestion)}
        >
          <Ionicons
            name="location-outline"
            size={Math.round(14 * scale)}
            color={colors.gold}
            style={styles.optionIcon}
          />
          <Text style={[styles.optionText, { fontSize }]} numberOfLines={2}>
            {suggestion}
          </Text>
        </Pressable>
      ))}
    </>
  );
}

function ModalSuggestions({
  draft,
  scale,
  onSelect,
}: {
  draft: string;
  scale: number;
  onSelect: (value: string) => void;
}) {
  const { suggestions, loading } = usePlaceSuggestions(draft, draft.trim().length >= 1);

  if (!loading && suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.modalDropdown}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
        style={styles.modalDropdownScroll}
      >
        <SuggestionList
          suggestions={suggestions}
          loading={loading}
          scale={scale}
          onSelect={onSelect}
        />
      </ScrollView>
    </View>
  );
}

export default function LocationAutocompleteInput({
  value,
  onChangeText,
  placeholder,
  icon,
  trailingIcon,
  onTrailingPress,
  editable = true,
  scale = 1,
  dense = false,
  webFit = false,
  inputGap,
}: LocationAutocompleteInputProps) {
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);

  const searchEnabled =
    Platform.OS === 'web' && !suppressSuggestions && value.trim().length >= 1;

  const { suggestions, loading } = usePlaceSuggestions(value, searchEnabled);
  const isOpen =
    Platform.OS === 'web' && searchEnabled && (loading || suggestions.length > 0);

  const selectSuggestion = (next: string) => {
    setSuppressSuggestions(true);
    onChangeText(next);
    requestAnimationFrame(() => {
      setSuppressSuggestions(false);
    });
  };

  const fontSize = Math.round((dense || webFit ? 12 : 13) * scale);

  return (
    <View style={styles.container}>
      <FormInput
        scale={scale}
        dense={dense}
        webFit={webFit}
        inputGap={isOpen ? 0 : inputGap}
        icon={icon}
        trailingIcon={trailingIcon}
        onTrailingPress={onTrailingPress}
        placeholder={placeholder}
        value={value}
        editable={editable}
        onChangeText={onChangeText}
        autoCorrect={false}
        closeOnKeyboardDismiss={false}
        sheetPlacement="top"
        renderModalExtras={({ draft, close }) => (
          <ModalSuggestions
            draft={draft}
            scale={scale}
            onSelect={(next) => {
              close(next);
            }}
          />
        )}
      />

      {isOpen ? (
        <View style={[styles.dropdown, { marginBottom: inputGap }]}>
          <ScrollView
            keyboardShouldPersistTaps="always"
            nestedScrollEnabled
            style={styles.dropdownScroll}
          >
            <SuggestionList
              suggestions={suggestions}
              loading={loading}
              scale={scale}
              onSelect={selectSuggestion}
            />
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundPanel,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 180,
  },
  modalDropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBg,
    overflow: 'hidden',
    marginBottom: 4,
  },
  modalDropdownScroll: {
    maxHeight: 200,
  },
  statusRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  statusText: {
    color: colors.textMuted,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionPressed: {
    backgroundColor: colors.inputBg,
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    flex: 1,
    color: colors.text,
  },
});
