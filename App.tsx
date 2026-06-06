import { useKeepAwake } from 'expo-keep-awake';
import { Platform, StyleSheet, View } from 'react-native';
import { BookingProvider, useBooking } from './src/context/BookingContext';
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

  return (
    <BookingProvider>
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
