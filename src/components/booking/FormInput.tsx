import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius } from '../../theme';

type FormInputProps = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onTrailingPress?: () => void;
  scale?: number;
  dense?: boolean;
  webFit?: boolean;
  inputGap?: number;
};

export default function FormInput({
  icon,
  trailingIcon,
  onTrailingPress,
  scale = 1,
  dense = false,
  webFit = false,
  inputGap,
  style,
  placeholderTextColor = colors.textMuted,
  ...props
}: FormInputProps) {
  const iconSize = Math.round(16 * scale);
  const tight = dense || webFit;
  const fieldHeight = Math.round(
    (tight ? 30 : scale < 0.7 ? 34 : 44) * scale,
  );
  const fieldPadding = Math.round(
    (tight ? 4 : scale < 0.45 ? 5 : 10) * scale,
  );
  const gap = inputGap ?? (dense ? Math.round(3 * scale) : scale < 0.7 ? 6 : 10);

  return (
    <View
      style={[
        styles.wrapper,
        {
          minHeight: fieldHeight,
          borderRadius: Math.round(radius.sm * scale),
          marginBottom: gap,
          paddingHorizontal: tight ? Math.round(8 * scale) : 12,
        },
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={iconSize}
          color={colors.gold}
          style={styles.leadingIcon}
          pointerEvents="none"
        />
      ) : null}
      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          editable={props.editable ?? true}
          placeholderTextColor={placeholderTextColor}
          style={[
            styles.input,
            {
              fontSize: Math.round((tight ? 13 : 14) * scale),
              paddingVertical: fieldPadding,
              minHeight: fieldHeight - fieldPadding * 2,
            },
            style,
          ]}
        />
      </View>
      {trailingIcon ? (
        onTrailingPress ? (
          <Pressable
            onPress={onTrailingPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Use current location"
          >
            <Ionicons name={trailingIcon} size={iconSize} color={colors.gold} />
          </Pressable>
        ) : (
          <Ionicons
            name={trailingIcon}
            size={iconSize}
            color={colors.gold}
            pointerEvents="none"
          />
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  leadingIcon: {
    marginRight: 10,
  },
  inputContainer: {
    flex: 1,
    minWidth: 0,
  },
  input: {
    flex: 1,
    width: '100%',
    color: colors.text,
  },
});
