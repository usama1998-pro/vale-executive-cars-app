import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useEffect, useRef } from 'react';
import {
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, radius, spacing } from '../../theme';

type CenteredInputModalProps = {
  visible: boolean;
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  onDone: () => void;
  onCancel: () => void;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
  scale?: number;
  children?: ReactNode;
};

export default function CenteredInputModal({
  visible,
  title,
  value,
  onChangeText,
  onDone,
  onCancel,
  keyboardType,
  autoCapitalize,
  autoCorrect = true,
  scale = 1,
  children,
}: CenteredInputModalProps) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'android') {
      return;
    }

    const onBackPress = () => {
      Keyboard.dismiss();
      onCancel();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => subscription.remove();
  }, [visible, onCancel]);

  const fontSize = Math.round(19 * scale);
  const titleSize = Math.round(14 * scale);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onCancel} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.avoiding, { pointerEvents: 'box-none' }]}
        >
          <View
            style={[styles.card, { padding: Math.round(spacing.lg * scale) }]}
          >
            <Text style={[styles.title, { fontSize: titleSize }]}>{title}</Text>
            <TextInput
              ref={inputRef}
              value={value}
              onChangeText={onChangeText}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              autoCorrect={autoCorrect}
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  fontSize,
                  paddingVertical: Math.round(12 * scale),
                  paddingHorizontal: Math.round(14 * scale),
                },
              ]}
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
                onDone();
              }}
            />
            {children}
            <Pressable
              style={[styles.doneButton, { paddingVertical: Math.round(12 * scale) }]}
              onPress={onDone}
            >
              <Text style={[styles.doneText, { fontSize: Math.round(15 * scale) }]}>
                DONE
              </Text>
              <Ionicons name="checkmark" size={Math.round(18 * scale)} color={colors.buttonText} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1, 26, 22, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  avoiding: {
    width: '100%',
    maxWidth: 520,
    justifyContent: 'center',
    zIndex: 1,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.backgroundPanel,
  },
  title: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBg,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  doneText: {
    color: colors.buttonText,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
