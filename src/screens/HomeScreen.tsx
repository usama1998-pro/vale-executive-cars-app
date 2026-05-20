import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import BookingForm from '../components/booking/BookingForm';
import Footer from '../components/booking/Footer';
import Header from '../components/booking/Header';
import LeftPanel from '../components/booking/LeftPanel';
import Screen from '../components/Screen';
import { useKeyboardPadding } from '../hooks/useKeyboardPadding';
import { useResponsive } from '../hooks/useResponsive';
import { colors } from '../theme';

export default function HomeScreen() {
  const {
    height,
    isTablet,
    isMobile,
    isWide,
    fitToScreen,
    scale,
    contentPadding,
    screenPaddingTop,
    screenPaddingBottom,
    columnGap,
    maxContentWidth,
  } = useResponsive();
  const keyboardPadding = useKeyboardPadding(32);

  const pagePadding = {
    paddingHorizontal: contentPadding,
    paddingTop: screenPaddingTop,
    paddingBottom: screenPaddingBottom + keyboardPadding,
  };

  const content = (
    <View
      style={[
        styles.content,
        fitToScreen && styles.contentFit,
        { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
      ]}
    >
      <Header scale={scale} isWide={isWide} compact={fitToScreen} />

      <View
        style={[
          styles.main,
          fitToScreen && styles.mainFit,
          isWide ? styles.mainWide : styles.mainStacked,
          { gap: columnGap },
        ]}
      >
        {isMobile ? (
          <>
            <BookingForm scale={scale} compact={fitToScreen} />
            <LeftPanel scale={scale} isWide={isWide} compact={fitToScreen} />
          </>
        ) : (
          <>
            <LeftPanel scale={scale} isWide={isWide} compact={fitToScreen} />
            <BookingForm scale={scale} compact={fitToScreen} />
          </>
        )}
      </View>

      <Footer scale={scale} isWide={isWide} isTablet={isTablet} compact={fitToScreen} />
    </View>
  );

  return (
    <Screen style={styles.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        {fitToScreen ? (
          <View style={[styles.fitRoot, pagePadding]}>{content}</View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              pagePadding,
              { minHeight: height },
            ]}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
            nestedScrollEnabled
          >
            {content}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  fitRoot: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
  },
  contentFit: {
    flex: 1,
  },
  main: {
    width: '100%',
  },
  mainFit: {
    flex: 1,
    minHeight: 0,
  },
  mainWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  mainStacked: {
    flexDirection: 'column',
  },
});
