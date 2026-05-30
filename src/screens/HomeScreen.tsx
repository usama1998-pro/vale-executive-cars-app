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
    width,
    height,
    isTablet,
    isMobile,
    isWide,
    isLandscape,
    isPhoneLandscape,
    isWeb,
    fitToScreen,
    scale,
    contentPadding,
    screenPaddingTop,
    screenPaddingBottom,
    columnGap,
    maxContentWidth,
  } = useResponsive();
  const keyboardPadding = useKeyboardPadding(32);
  const isTabletPortrait = isTablet && !isLandscape;
  const compactLayout = fitToScreen && !isWeb;
  const webFit = isWeb && fitToScreen;
  const sideBySide = isWide && !isTabletPortrait;
  const formFirst = (isMobile && !isPhoneLandscape) || isTabletPortrait;
  const layoutKey = `${Math.round(width)}x${Math.round(height)}-${fitToScreen ? 'fit' : 'scroll'}`;

  const pagePadding = {
    paddingHorizontal: contentPadding,
    paddingTop: screenPaddingTop,
    paddingBottom: screenPaddingBottom + (isWeb ? 0 : keyboardPadding),
  };

  const content = (
    <View
      style={[
        styles.content,
        fitToScreen && styles.contentFit,
        { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
      ]}
    >
      <Header scale={scale} isWide={isWide} compact={compactLayout} isWeb={isWeb} webFit={webFit} />

      <View
        style={[
          styles.main,
          fitToScreen && styles.mainFit,
          sideBySide ? styles.mainWide : styles.mainStacked,
          { gap: columnGap },
        ]}
      >
        {formFirst ? (
          <>
            <View style={fitToScreen ? styles.columnFit : undefined}>
              <BookingForm
                scale={scale}
                compact={compactLayout}
                dense={isPhoneLandscape}
                fill={fitToScreen}
                isWeb={isWeb}
              />
            </View>
            <View style={fitToScreen ? styles.columnFit : undefined}>
              <LeftPanel
                scale={scale}
                isWide={isWide}
                compact={compactLayout}
                dense={isPhoneLandscape}
                fill={fitToScreen}
                isWeb={isWeb}
                webFit={webFit}
              />
            </View>
          </>
        ) : (
          <>
            <View style={fitToScreen ? styles.columnFit : undefined}>
              <LeftPanel
                scale={scale}
                isWide={isWide}
                compact={compactLayout}
                dense={isPhoneLandscape}
                fill={fitToScreen}
                isWeb={isWeb}
                webFit={webFit}
              />
            </View>
            <View style={fitToScreen ? styles.columnFit : undefined}>
              <BookingForm
                scale={scale}
                compact={compactLayout}
                dense={isPhoneLandscape}
                fill={fitToScreen}
                isWeb={isWeb}
              />
            </View>
          </>
        )}
      </View>

      <Footer
        scale={scale}
        isWide={isWide || isPhoneLandscape || isWeb}
        isTablet={isTablet || isPhoneLandscape || isWeb}
        compact={compactLayout}
        isWeb={isWeb}
        webFit={webFit}
      />
    </View>
  );

  return (
    <Screen style={styles.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={Platform.OS !== 'web'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        {fitToScreen ? (
          <View key={layoutKey} style={[styles.fitRoot, pagePadding]}>
            {content}
          </View>
        ) : (
          <ScrollView
            key={layoutKey}
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, pagePadding]}
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
    paddingBottom: 8,
  },
  content: {
    width: '100%',
  },
  contentFit: {
    flex: 1,
    minHeight: 0,
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
  columnFit: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
  },
});
