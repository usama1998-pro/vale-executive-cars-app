import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, radius } from '../../theme';
import CenteredInputModal from './CenteredInputModal';

type FormInputProps = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  trailingIconColor?: string;
  onTrailingPress?: () => void;
  scale?: number;
  dense?: boolean;
  webFit?: boolean;
  inputGap?: number;
  centeredEditor?: boolean;
  renderModalExtras?: (ctx: {
    draft: string;
    setDraft: (value: string) => void;
    close: (finalValue?: string) => void;
  }) => ReactNode;
};

export default function FormInput({
  icon,
  trailingIcon,
  trailingIconColor = colors.gold,
  onTrailingPress,
  scale = 1,
  dense = false,
  webFit = false,
  inputGap,
  centeredEditor = Platform.OS !== 'web',
  renderModalExtras,
  style,
  placeholderTextColor = colors.textMuted,
  placeholder,
  value,
  onChangeText,
  editable = true,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  ...props
}: FormInputProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState(value ?? '');

  useEffect(() => {
    if (!editorOpen) {
      setDraft(value ?? '');
    }
  }, [value, editorOpen]);

  const iconSize = Math.round(21 * scale);
  const tight = dense || webFit;
  const fieldHeight = Math.round(
    (tight ? 40 : scale < 0.7 ? 44 : 54) * scale,
  );
  const fieldPaddingVertical = Math.round(
    (tight ? 8 : scale < 0.45 ? 9 : 11) * scale,
  );
  const wrapperPaddingHorizontal = Math.round((tight ? 12 : 16) * scale);
  const fontSize = Math.round((tight ? 17 : 19) * scale);
  const gap = inputGap ?? (dense ? Math.round(1 * scale) : scale < 0.7 ? 3 : 4);
  const displayValue = value ?? '';

  const openEditor = () => {
    if (!editable || !centeredEditor) {
      return;
    }
    setDraft(displayValue);
    setEditorOpen(true);
  };

  const commitEditor = (finalValue?: string) => {
    onChangeText?.(finalValue ?? draft);
    setEditorOpen(false);
  };

  const cancelEditor = () => {
    setDraft(displayValue);
    setEditorOpen(false);
  };

  const fieldBody =
    centeredEditor && editable ? (
      <Pressable
        style={[
          styles.inputContainer,
          styles.pressableField,
          {
            minHeight: fieldHeight - fieldPaddingVertical * 2,
            paddingVertical: fieldPaddingVertical,
            paddingHorizontal: Math.round(4 * scale),
          },
        ]}
        onPress={openEditor}
        accessibilityRole="button"
        accessibilityLabel={placeholder ?? 'Edit field'}
      >
        <Text
          style={[
            styles.displayText,
            {
              fontSize,
              color: displayValue ? colors.text : placeholderTextColor,
            },
          ]}
          numberOfLines={2}
        >
          {displayValue || placeholder}
        </Text>
      </Pressable>
    ) : (
      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={displayValue}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          style={[
            styles.input,
            {
              fontSize,
              paddingVertical: fieldPaddingVertical,
              paddingHorizontal: Math.round(4 * scale),
              minHeight: fieldHeight - fieldPaddingVertical * 2,
            },
            style,
          ]}
        />
      </View>
    );

  return (
    <>
      <View
        style={[
          styles.wrapper,
          {
            minHeight: fieldHeight,
            borderRadius: Math.round(radius.sm * scale),
            marginBottom: gap,
            paddingHorizontal: wrapperPaddingHorizontal,
          },
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={iconSize}
            color={colors.gold}
            style={[
              styles.leadingIcon,
              { marginRight: Math.round(8 * scale), pointerEvents: 'none' },
            ]}
          />
        ) : null}
        {fieldBody}
        {trailingIcon ? (
          onTrailingPress ? (
            <Pressable
              onPress={onTrailingPress}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Field action"
            >
              <Ionicons name={trailingIcon} size={iconSize} color={trailingIconColor} />
            </Pressable>
          ) : (
            <Ionicons
              name={trailingIcon}
              size={iconSize}
              color={trailingIconColor}
              style={{ pointerEvents: 'none' }}
            />
          )
        ) : null}
      </View>

      {centeredEditor ? (
        <CenteredInputModal
          visible={editorOpen}
          title={placeholder ?? 'Edit'}
          value={draft}
          onChangeText={setDraft}
          onDone={commitEditor}
          onCancel={cancelEditor}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          scale={scale}
        >
          {renderModalExtras?.({
            draft,
            setDraft,
            close: commitEditor,
          })}
        </CenteredInputModal>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    overflow: 'hidden',
  },
  leadingIcon: {
    flexShrink: 0,
  },
  inputContainer: {
    flex: 1,
    minWidth: 0,
  },
  pressableField: {
    justifyContent: 'center',
  },
  displayText: {
    lineHeight: 22,
  },
  input: {
    flex: 1,
    width: '100%',
    color: colors.text,
  },
});
