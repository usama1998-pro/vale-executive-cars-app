import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius } from '../../theme';

type GoldButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'filled' | 'outline';
  scale?: number;
  style?: ViewStyle | (ViewStyle | false | undefined)[];
};

export default function GoldButton({
  label,
  onPress,
  icon,
  variant = 'filled',
  scale = 1,
  style,
}: GoldButtonProps) {
  const isFilled = variant === 'filled';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isFilled ? styles.filled : styles.outline,
        { paddingVertical: Math.round(12 * scale), paddingHorizontal: Math.round(16 * scale) },
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={Math.round(18 * scale)}
          color={isFilled ? colors.buttonText : colors.gold}
          style={styles.icon}
        />
      ) : null}
      <Text
        style={[
          styles.label,
          {
            fontSize: Math.round(Math.max((isFilled ? 15 : 13) * scale, isFilled ? 13 : 11)),
            color: isFilled ? colors.buttonText : colors.gold,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  filled: {
    backgroundColor: colors.gold,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
