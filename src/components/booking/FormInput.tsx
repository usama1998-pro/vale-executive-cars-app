import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius } from '../../theme';

type FormInputProps = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  scale?: number;
};

export default function FormInput({
  icon,
  trailingIcon,
  scale = 1,
  style,
  placeholderTextColor = colors.textMuted,
  ...props
}: FormInputProps) {
  const iconSize = Math.round(16 * scale);

  return (
    <View
      style={[
        styles.wrapper,
        {
          minHeight: Math.round((scale < 0.7 ? 34 : 44) * scale),
          borderRadius: Math.round(radius.sm * scale),
          marginBottom: scale < 0.7 ? 6 : 10,
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
              fontSize: Math.round(14 * scale),
              paddingVertical: Math.round(10 * scale),
            },
            style,
          ]}
        />
      </View>
      {trailingIcon ? (
        <Ionicons
          name={trailingIcon}
          size={iconSize}
          color={colors.gold}
          pointerEvents="none"
        />
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
    minHeight: 40,
    color: colors.text,
  },
});
