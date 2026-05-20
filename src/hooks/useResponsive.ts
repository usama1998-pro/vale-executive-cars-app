import { useWindowDimensions } from 'react-native';

const TABLET_MIN = 600;
const WIDE_MIN = 900;
const LANDSCAPE_FIT_HEIGHT = 520;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const shortest = Math.min(width, height);
  const isLandscape = width > height;
  const isTabletDevice = shortest >= TABLET_MIN;
  const isTabletLayout = isTabletDevice || (isLandscape && width >= TABLET_MIN);
  const isMobile = !isTabletLayout;
  const isWide =
    isTabletLayout && (isLandscape ? width >= TABLET_MIN : width >= WIDE_MIN);
  const fitToScreen = isWide && isLandscape;
  const baseScale = Math.min(Math.max(shortest / 768, 0.85), 1.25);
  const layoutScale = fitToScreen
    ? Math.min(baseScale, Math.max(0.55, height / LANDSCAPE_FIT_HEIGHT))
    : baseScale;

  const contentPadding = isTabletLayout ? spacingFor(layoutScale, 20, 32) : 16;
  const screenPaddingTop = fitToScreen
    ? 8
    : isMobile
      ? 32
      : spacingFor(layoutScale, 28, 40);
  const screenPaddingBottom = fitToScreen
    ? 8
    : isMobile
      ? 56
      : screenPaddingTop;
  const columnGap = fitToScreen ? 10 : isWide ? spacingFor(layoutScale, 20, 28) : 16;
  const maxContentWidth = isWide ? Math.min(width * 0.96, 1400) : width;

  return {
    width,
    height,
    isTablet: isTabletLayout,
    isTabletDevice,
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
