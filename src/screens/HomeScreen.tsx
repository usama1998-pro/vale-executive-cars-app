import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import BookingForm from '../components/booking/BookingForm';
import LeftPanel from '../components/booking/LeftPanel';
import StartSplashOverlay from '../components/booking/StartSplashOverlay';
import Screen from '../components/Screen';
import { useBooking } from '../context/BookingContext';
import { useKeyboardPadding } from '../hooks/useKeyboardPadding';
import { useResponsive } from '../hooks/useResponsive';
import { colors } from '../theme';

const useNativeDriver = Platform.OS !== 'web';

export default function HomeScreen() {
  const { startSplashDismissed, dismissStartSplash } = useBooking();
  const { height: windowHeight } = useWindowDimensions();
  const [showSplash, setShowSplash] = useState(!startSplashDismissed);
  const splashOffset = useRef(new Animated.Value(0)).current;
  const dismissing = useRef(false);

  const dismissSplash = useCallback(() => {
    if (dismissing.current || startSplashDismissed) {
      return;
    }
    dismissing.current = true;
    Animated.timing(splashOffset, {
      toValue: windowHeight,
      duration: 700,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver,
    }).start(({ finished }) => {
      if (finished) {
        dismissStartSplash();
        setShowSplash(false);
      }
      dismissing.current = false;
    });
  }, [dismissStartSplash, splashOffset, startSplashDismissed, windowHeight]);

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
      <View style={styles.homeRoot}>
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

        {showSplash ? (
          <Animated.View
            pointerEvents="auto"
            style={[
              styles.splashLayer,
              { transform: [{ translateY: splashOffset }] },
            ]}
          >
            <StartSplashOverlay onPress={dismissSplash} />
          </Animated.View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  homeRoot: {
    flex: 1,
  },
  splashLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    elevation: 20,
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
