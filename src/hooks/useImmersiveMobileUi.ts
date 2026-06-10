import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

export function useImmersiveMobileUi(enabled = true) {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (!enabled || Platform.OS !== 'android') {
      return undefined;
    }

    // With edgeToEdgeEnabled, only visibility APIs are supported at runtime.
    // Bar color/behavior are configured via app.json android.navigationBar.
    void NavigationBar.setVisibilityAsync('hidden');
  }, [enabled, width, height]);
}
