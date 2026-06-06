import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme';
import { searchLocations } from '../../services/locationSearch';
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
  scale,
  onSelect,
}: {
  suggestions: string[];
  scale: number;
  onSelect: (value: string) => void;
}) {
  const fontSize = Math.round(14 * scale);

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
  const suggestions = useMemo(() => searchLocations(draft), [draft]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View style={styles.modalDropdown}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
        style={styles.modalDropdownScroll}
      >
        <SuggestionList suggestions={suggestions} scale={scale} onSelect={onSelect} />
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
  const suppressNextSearch = useRef(false);
  const suggestions = useMemo(() => {
    if (Platform.OS !== 'web') {
      return [];
    }
    if (suppressNextSearch.current) {
      return [];
    }
    const trimmed = value.trim();
    if (trimmed.length < 1) {
      return [];
    }
    return searchLocations(value);
  }, [value]);

  const isOpen = Platform.OS === 'web' && suggestions.length > 0;

  const selectSuggestion = (next: string) => {
    suppressNextSearch.current = true;
    onChangeText(next);
    requestAnimationFrame(() => {
      suppressNextSearch.current = false;
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
            {suggestions.map((suggestion) => (
              <Pressable
                key={suggestion}
                style={({ pressed }) => [
                  styles.option,
                  pressed && styles.optionPressed,
                ]}
                onPress={() => selectSuggestion(suggestion)}
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
