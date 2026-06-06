import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import BookingForm from '../components/booking/BookingForm';
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
  const keyboardOpen = keyboardPadding > 0;
  const isTabletPortrait = isTablet && !isLandscape;
  const isTabletLandscape = isTablet && isLandscape;
  const compactLayout = fitToScreen && !isWeb;
  const webFit = isWeb && fitToScreen;
  const sideBySide = isWide && !isTabletPortrait;
  const formFirst = (isMobile && !isPhoneLandscape) || isTabletPortrait;
  const layoutKey = `${Math.round(width)}x${Math.round(height)}-${fitToScreen ? 'fit' : 'scroll'}`;
  const keyboardScrollPad = isWeb ? 0 : keyboardPadding;
  const canScroll = isMobile || !fitToScreen || keyboardOpen;

  const pagePadding = {
    paddingHorizontal: contentPadding,
    paddingTop: screenPaddingTop,
    paddingBottom: screenPaddingBottom + keyboardScrollPad,
  };

  const leftColumn = (
    <View
      style={[
        fitToScreen ? styles.columnFit : undefined,
        sideBySide && styles.leftColumn,
      ]}
    >
      <LeftPanel
        scale={scale}
        isWide={isWide}
        compact={compactLayout}
        dense={isPhoneLandscape}
        fill={fitToScreen && sideBySide}
        isWeb={isWeb}
        webFit={webFit}
      />
    </View>
  );

  const formColumn = (
    <View
      style={[
        fitToScreen ? styles.columnFit : undefined,
        sideBySide && styles.formColumn,
      ]}
    >
      <BookingForm
        scale={scale}
        compact={compactLayout}
        dense={isPhoneLandscape}
        fill={fitToScreen}
        isWeb={isWeb}
        keyboardInset={keyboardScrollPad}
      />
    </View>
  );

  const content = (
    <View
      style={[
        styles.content,
        fitToScreen && styles.contentFit,
        { maxWidth: maxContentWidth, alignSelf: 'center', width: '100%' },
      ]}
    >
      <View
        style={[
          styles.main,
          fitToScreen && styles.mainFit,
          sideBySide ? styles.mainWide : styles.mainStacked,
          isTabletLandscape && styles.mainTabletLandscape,
          { gap: columnGap },
        ]}
      >
        {formFirst ? (
          <>
            {formColumn}
            {leftColumn}
          </>
        ) : (
          <>
            {leftColumn}
            {formColumn}
          </>
        )}
      </View>
    </View>
  );

  return (
    <Screen style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView
        key={layoutKey}
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          fitToScreen && styles.scrollContentFit,
          keyboardOpen && fitToScreen && styles.scrollKeyboardOpen,
          pagePadding,
        ]}
        scrollEnabled={canScroll}
        showsVerticalScrollIndicator={canScroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        nestedScrollEnabled
      >
        {content}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  scrollContentFit: {
    minHeight: '100%',
  },
  scrollKeyboardOpen: {
    justifyContent: 'flex-start',
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
  mainTabletLandscape: {
    flex: 1,
  },
  mainStacked: {
    flexDirection: 'column',
  },
  columnFit: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  formColumn: {
    flex: 1,
    minWidth: 0,
  },
});
