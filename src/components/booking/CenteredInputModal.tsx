import { Ionicons } from '@expo/vector-icons';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Keyboard,
  KeyboardEvent,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  useWindowDimensions,
  View,
  StatusBar,
} from 'react-native';
import { colors, radius, spacing } from '../../theme';

type SheetPlacement = 'default' | 'top';

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
  closeOnKeyboardDismiss?: boolean;
  sheetPlacement?: SheetPlacement;
  children?: ReactNode;
};

function useKeyboardHeight(enabled: boolean): number {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setKeyboardHeight(0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event: KeyboardEvent) => {
      setKeyboardHeight(event.endCoordinates.height);
    };
    const onHide = () => {
      setKeyboardHeight(0);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [enabled]);

  return keyboardHeight;
}

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
  closeOnKeyboardDismiss = true,
  sheetPlacement = 'default',
  children,
}: CenteredInputModalProps) {
  const inputRef = useRef<TextInput>(null);
  const closingRef = useRef(false);
  const keyboardSeenRef = useRef(false);
  const { height: windowHeight } = useWindowDimensions();
  const keyboardHeight = useKeyboardHeight(visible);
  const keyboardOpen = keyboardHeight > 0;
  const statusBarInset =
    Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : spacing.lg;
  const sheetTop =
    sheetPlacement === 'top'
      ? statusBarInset + spacing.sm
      : Math.round(windowHeight * 0.14);
  const iosKeyboardShift =
    sheetPlacement === 'top' || Platform.OS !== 'ios' || !keyboardOpen
      ? 0
      : Math.min(Math.round(keyboardHeight * 0.22), sheetTop - spacing.lg);

  const handleDone = useCallback(() => {
    closingRef.current = true;
    Keyboard.dismiss();
    onDone();
  }, [onDone]);

  const handleCancel = useCallback(() => {
    closingRef.current = true;
    Keyboard.dismiss();
    onCancel();
  }, [onCancel]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    closingRef.current = false;
    keyboardSeenRef.current = false;
    const timer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (!visible || !closeOnKeyboardDismiss) {
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = () => {
      keyboardSeenRef.current = true;
    };
    const onHide = () => {
      if (closingRef.current || !keyboardSeenRef.current) {
        return;
      }
      handleDone();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [visible, closeOnKeyboardDismiss, handleDone]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'android') {
      return;
    }

    const onBackPress = () => {
      handleCancel();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => subscription.remove();
  }, [visible, handleCancel]);

  const fontSize = Math.round(19 * scale);
  const titleSize = Math.round(14 * scale);
  const inputMinHeight = Math.round(48 * scale);
  const inputPaddingVertical = Math.round(12 * scale);
  const inputPaddingHorizontal = Math.round(14 * scale);
  const cardPadding = Math.round(spacing.lg * scale);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={handleCancel} />
        <View
          style={[
            styles.sheet,
            {
              top: sheetTop - iosKeyboardShift,
              paddingHorizontal: spacing.lg,
            },
          ]}
        >
          <View style={[styles.card, { padding: cardPadding }]}>
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
                  minHeight: inputMinHeight,
                  paddingVertical: inputPaddingVertical,
                  paddingHorizontal: inputPaddingHorizontal,
                },
              ]}
              returnKeyType="done"
              onSubmitEditing={handleDone}
            />
            {children}
            <Pressable
              style={[styles.doneButton, { paddingVertical: Math.round(12 * scale) }]}
              onPress={handleDone}
            >
              <Text style={[styles.doneText, { fontSize: Math.round(15 * scale) }]}>
                DONE
              </Text>
              <Ionicons name="checkmark" size={Math.round(18 * scale)} color={colors.buttonText} />
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  title: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    textAlign: 'center',
    flexShrink: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.inputBg,
    color: colors.text,
    marginBottom: spacing.sm,
    flexShrink: 0,
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
