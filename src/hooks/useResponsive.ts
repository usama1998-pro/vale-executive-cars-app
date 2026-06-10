import { Platform, StatusBar, useWindowDimensions } from 'react-native';

const TABLET_MIN = 600;
const WIDE_MIN = 900;
const WEB_WIDE_MIN = 768;
const LANDSCAPE_FIT_HEIGHT = 520;
const PHONE_LANDSCAPE_FIT_HEIGHT = 920;
const FIT_EDGE_PADDING = 8;
const SCREEN_TOP_PADDING = 8;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const shortest = Math.min(width, height);
  const isLandscape = width > height;
  const webWide = isWeb && width >= WEB_WIDE_MIN;
  const isTabletDevice = isWeb ? webWide : shortest >= TABLET_MIN;
  const isTabletLayout = isTabletDevice;
  const isMobile = !isTabletLayout;
  const isPhoneLandscape =
    !isWeb && isLandscape && isMobile && width >= TABLET_MIN;
  const isWide =
    webWide ||
    isPhoneLandscape ||
    (isTabletLayout && (isLandscape ? width >= TABLET_MIN : width >= WIDE_MIN));

  const webFit = isWeb && webWide;
  const nativeFit =
    !isWeb && isLandscape && isWide && (isTabletDevice || isPhoneLandscape);
  const fitToScreen = webFit || nativeFit;

  const hideSystemBars = !isWeb;
  const statusBarInset = hideSystemBars
    ? 0
    : Platform.OS === 'android'
      ? (StatusBar.currentHeight ?? 24)
      : 0;
  const fitPaddingTop = fitToScreen
    ? isWeb
      ? SCREEN_TOP_PADDING
      : hideSystemBars
        ? isPhoneLandscape
          ? 4
          : FIT_EDGE_PADDING
        : statusBarInset + (isPhoneLandscape ? 4 : FIT_EDGE_PADDING)
    : 0;
  const fitPaddingBottom = fitToScreen
    ? isWeb
      ? 12
      : hideSystemBars
        ? isPhoneLandscape
          ? 8
          : FIT_EDGE_PADDING + 8
        : isPhoneLandscape
          ? 8
          : FIT_EDGE_PADDING + 12
    : 0;
  const fitContentHeight = height - fitPaddingTop - fitPaddingBottom;

  const baseScale = isWeb
    ? Math.min(Math.max(height / 800, 0.75), 1.15)
    : Math.min(Math.max(shortest / 768, 0.85), 1.25);

  const layoutScale = fitToScreen
    ? isWeb
      ? Math.min(baseScale, Math.max(0.65, fitContentHeight / 820))
      : Math.min(
          baseScale,
          Math.max(
            isPhoneLandscape ? 0.34 : 0.55,
            fitContentHeight /
              (isPhoneLandscape
                ? PHONE_LANDSCAPE_FIT_HEIGHT
                : LANDSCAPE_FIT_HEIGHT),
          ),
        )
    : baseScale;

  const contentPadding = fitToScreen
    ? isWeb
      ? Math.round(Math.max(16, width * 0.02))
      : isPhoneLandscape
        ? 8
        : spacingFor(layoutScale, 20, 32)
    : isTabletLayout
      ? spacingFor(layoutScale, 20, 32)
      : isWeb
        ? 20
        : 16;

  const screenPaddingTop = fitToScreen
    ? fitPaddingTop
    : isWeb
      ? SCREEN_TOP_PADDING
      : hideSystemBars
        ? SCREEN_TOP_PADDING
        : isMobile
          ? statusBarInset + SCREEN_TOP_PADDING
          : spacingFor(layoutScale, 12, 20);

  const screenPaddingBottom = fitToScreen
    ? fitPaddingBottom
    : isWeb
      ? 24
      : hideSystemBars
        ? FIT_EDGE_PADDING + 8
        : isMobile
          ? 56
          : screenPaddingTop;

  const columnGap = fitToScreen
    ? isWeb
      ? Math.round(16 * layoutScale)
      : isPhoneLandscape
        ? 6
        : 10
    : isWide
      ? spacingFor(layoutScale, 20, 28)
      : 16;

  const maxContentWidth = isWide
    ? Math.min(width * 0.96, isWeb ? 1400 : 1400)
    : width;

  return {
    width,
    height,
    isWeb,
    webWide,
    isTablet: isTabletLayout,
    isTabletDevice,
    isPhoneLandscape,
    isMobile,
    isWide,
    isLandscape,
    fitToScreen,
    scale: layoutScale,
    contentPadding,
    screenPaddingTop,
    screenPaddingBottom,
    columnGap,
    maxContentWidth,
  };
}

function spacingFor(scale: number, min: number, max: number) {
  return Math.round(min + (max - min) * Math.min((scale - 0.85) / 0.4, 1));
}
