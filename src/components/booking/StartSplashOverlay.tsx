import { Image, StyleSheet, Text, View } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, spacing } from '../../theme';
import BookTaxiPulseButton from './BookTaxiPulseButton';

const LOGO = require('../../../assets/vale-executive-brand-logo.png');
const LOGO_ASPECT = 795 / 314;

type StartSplashOverlayProps = {
  onPress: () => void;
};

function buttonCanvasSize(buttonSize: number) {
  const spread = Math.round(buttonSize * 1.05);
  return buttonSize + spread * 1.9;
}

function estimateLeftHeight(
  logoHeight: number,
  headlineSize: number,
  sublineSize: number,
) {
  return (
    logoHeight +
    sublineSize * 1.1 +
    headlineSize * 0.14 +
    headlineSize * 0.1 +
    headlineSize * 0.98 * 2
  );
}

function fitSingleLineFontSize(
  baseSize: number,
  text: string,
  maxWidth: number,
  minSize: number,
) {
  const estimated = maxWidth / (text.length * 0.58);
  return Math.round(Math.max(minSize, Math.min(baseSize, estimated)));
}

export default function StartSplashOverlay({ onPress }: StartSplashOverlayProps) {
  const { width, height, isLandscape, scale, contentPadding } = useResponsive();

  const isPortrait = !isLandscape;
  const verticalPadding = spacing.sm * 2;
  const availableHeight = height - verticalPadding;
  const availableWidth = Math.min(width - contentPadding * 2, 1400);

  let layoutGap = isPortrait ? Math.round(28 * scale) : Math.round(8 * scale);

  let buttonSize: number;
  let logoHeight: number;
  let headlineBase: number;
  let sublineBase: number;
  let copyWidth: number;

  if (isPortrait) {
    copyWidth = Math.round(availableWidth * 0.94);
    logoHeight = Math.min(
      Math.round(availableWidth * 0.88),
      Math.round(height * 0.4),
    );
    headlineBase = Math.round(96 * scale);
    sublineBase = Math.round(44 * scale);
    buttonSize = Math.min(
      Math.round(availableWidth * 0.4),
      Math.round(availableHeight * 0.19),
      Math.round(230 * scale),
    );
  } else {
    buttonSize = Math.round(availableHeight * 0.5);
    logoHeight = Math.round(availableHeight * 0.58);
    copyWidth = Math.round(logoHeight * LOGO_ASPECT);
    const maxCopyWidth = Math.round(
      availableWidth - buttonSize - layoutGap - buttonSize * 0.5,
    );
    if (copyWidth > maxCopyWidth) {
      copyWidth = Math.max(240, maxCopyWidth);
      logoHeight = Math.round(copyWidth / LOGO_ASPECT);
    }
    headlineBase = Math.round(availableHeight * 0.18);
    sublineBase = Math.round(availableHeight * 0.078);
  }

  let headlineSize = fitSingleLineFontSize(
    headlineBase,
    'TAXI RIDE',
    copyWidth,
    Math.round((isPortrait ? 40 : 32) * scale),
  );
  let sublineSize = fitSingleLineFontSize(
    sublineBase,
    'TOUCH HERE TO',
    copyWidth,
    Math.round((isPortrait ? 22 : 18) * scale),
  );

  const leftHeight = estimateLeftHeight(logoHeight, headlineSize, sublineSize);
  const buttonCanvas = buttonCanvasSize(buttonSize);
  const contentHeight = isPortrait
    ? leftHeight + layoutGap + buttonCanvas
    : Math.max(leftHeight, buttonSize);
  const contentWidth = isPortrait
    ? Math.max(copyWidth, buttonCanvas)
    : copyWidth + layoutGap + buttonSize + Math.round(buttonSize * 0.5);

  const heightFit = availableHeight / contentHeight;
  const widthFit = availableWidth / contentWidth;
  const fitScale = Math.min(heightFit, widthFit, 1);

  if (fitScale < 1) {
    if (isPortrait) {
      buttonSize = Math.round(buttonSize * fitScale);
      logoHeight = Math.round(logoHeight * fitScale);
      headlineSize = Math.round(headlineSize * fitScale);
      sublineSize = Math.round(sublineSize * fitScale);
      layoutGap = Math.round(layoutGap * fitScale);
      const minLogoHeight = Math.round(copyWidth * 0.65);
      logoHeight = Math.max(logoHeight, minLogoHeight);
    } else {
      logoHeight = Math.round(logoHeight * fitScale);
      headlineSize = Math.round(headlineSize * fitScale);
      sublineSize = Math.round(sublineSize * fitScale);
      layoutGap = Math.round(layoutGap * fitScale);
    }
  }

  if (isPortrait) {
    logoHeight = Math.min(
      logoHeight,
      Math.round(availableHeight * 0.42),
      Math.round(copyWidth * 0.92),
    );
  } else {
    logoHeight = Math.min(
      logoHeight,
      Math.round(copyWidth / LOGO_ASPECT),
      Math.round(availableHeight * 0.66),
    );
  }

  const textBlock = (
    <View style={[styles.copy, { width: copyWidth }]} pointerEvents="none">
      <Image
        source={LOGO}
        style={[
          styles.logo,
          {
            height: logoHeight,
            width: copyWidth,
          },
        ]}
        resizeMode="contain"
        accessibilityLabel="Vale Executive Cars logo"
      />
      <View style={[styles.textGroup, { width: copyWidth }]}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
          style={[
            styles.touchLine,
            {
              fontSize: sublineSize,
              lineHeight: Math.round(sublineSize * 1.1),
              marginTop: Math.round(headlineSize * 0.14),
              marginBottom: Math.round(headlineSize * 0.1),
            },
          ]}
        >
          TOUCH HERE TO
        </Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
          style={[
            styles.bookLine,
            {
              fontSize: headlineSize,
              lineHeight: Math.round(headlineSize * 0.98),
            },
          ]}
        >
          BOOK A
        </Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
          style={[
            styles.rideLine,
            {
              fontSize: headlineSize,
              lineHeight: Math.round(headlineSize * 0.98),
            },
          ]}
        >
          TAXI RIDE
        </Text>
      </View>
    </View>
  );

  const buttonBlock = (
    <View
      style={[
        styles.buttonWrap,
        { width: buttonSize, height: buttonSize },
      ]}
    >
      <BookTaxiPulseButton size={buttonSize} onPress={onPress} />
    </View>
  );

  return (
    <View style={[styles.screen, { paddingHorizontal: contentPadding }]}>
      <View style={styles.centerShell} pointerEvents="box-none">
        <View
          pointerEvents="box-none"
          style={[
            isPortrait ? styles.mainColumn : styles.mainRow,
            { gap: layoutGap, maxWidth: availableWidth },
          ]}
        >
          {textBlock}
          {buttonBlock}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    overflow: 'hidden',
  },
  centerShell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    overflow: 'visible',
  },
  mainColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    overflow: 'visible',
  },
  copy: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  logo: {
    alignSelf: 'center',
  },
  textGroup: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  touchLine: {
    color: colors.gold,
    fontWeight: '600',
    letterSpacing: 1.5,
    textAlign: 'center',
    width: '100%',
  },
  bookLine: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.6,
    textAlign: 'center',
    width: '100%',
  },
  rideLine: {
    color: colors.gold,
    fontWeight: '800',
    letterSpacing: 0.6,
    textAlign: 'center',
    width: '100%',
  },
  buttonWrap: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
