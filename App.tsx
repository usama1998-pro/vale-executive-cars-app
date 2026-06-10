import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import { BookingProvider, useBooking } from './src/context/BookingContext';
import { useImmersiveMobileUi } from './src/hooks/useImmersiveMobileUi';
import BookingStatusScreen from './src/screens/BookingStatusScreen';
import EstimateScreen from './src/screens/EstimateScreen';
import HomeScreen from './src/screens/HomeScreen';
import ReviewBookingScreen from './src/screens/ReviewBookingScreen';

function AppContent() {
  const { screen } = useBooking();

  return (
    <View style={styles.root}>
      {screen === 'home' && <HomeScreen />}
      {screen === 'estimate' && <EstimateScreen />}
      {screen === 'review' && <ReviewBookingScreen />}
      {screen === 'status' && <BookingStatusScreen />}
    </View>
  );
}

export default function App() {
  useKeepAwake();
  useImmersiveMobileUi(Platform.OS !== 'web');

  return (
    <BookingProvider>
      <StatusBar hidden={Platform.OS !== 'web'} style="light" />
      <AppContent />
    </BookingProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...(Platform.OS === 'web'
      ? ({
          minHeight: '100vh',
          width: '100%',
        } as object)
      : null),
  },
});
