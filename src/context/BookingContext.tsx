import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { createBookingOnApi } from '../services/api/bookingsApi';
import { fetchRouteQuote } from '../services/api/routingApi';
import {
  clearBookingCache,
  getStoredCustomers,
  saveCustomerBooking,
} from '../services/storage';
import {
  BookingDetails,
  BookingFormData,
  EMPTY_BOOKING_FORM,
  isMeaningfulVia,
  VehicleType,
} from '../types/booking';
import { getDefaultPickupDate } from '../utils/dateTime';
import { formatApiErrorMessage } from '../lib/apiErrors';
import { getCurrentLocationAddress } from '../utils/location';
import { parsePassengerCount } from '../utils/passengers';
import { calculateFare } from '../utils/pricing';

export type AppScreen = 'home' | 'estimate' | 'review' | 'status';

type BookingContextValue = {
  screen: AppScreen;
  form: BookingFormData;
  pendingBooking: BookingDetails | null;
  submittedBooking: BookingDetails | null;
  isCheckingAvailability: boolean;
  isSubmitting: boolean;
  isCalculatingQuote: boolean;
  quoteFares: Record<VehicleType, number> | null;
  customers: BookingDetails[];
  updateForm: (patch: Partial<BookingFormData>) => void;
  goToEstimate: () => Promise<void>;
  goToReview: () => void;
  goBackToEstimate: () => void;
  goHome: () => void;
  goHomeAndClearCache: () => Promise<void>;
  updatePendingVehicle: (vehicle: VehicleType) => void;
  submitBookingRequest: () => Promise<void>;
  startSplashDismissed: boolean;
  dismissStartSplash: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [form, setForm] = useState<BookingFormData>(EMPTY_BOOKING_FORM);
  const [pendingBooking, setPendingBooking] = useState<BookingDetails | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingDetails | null>(null);
  const [isCheckingAvailability] = useState(false);
  const [customers, setCustomers] = useState<BookingDetails[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculatingQuote, setIsCalculatingQuote] = useState(false);
  const [quoteFares, setQuoteFares] = useState<Record<VehicleType, number> | null>(
    null,
  );
  const [startSplashDismissed, setStartSplashDismissed] = useState(false);
  const dismissStartSplash = useCallback(() => {
    setStartSplashDismissed(true);
  }, []);
  const initializeHomeForm = useCallback(async () => {
    await clearBookingCache();
    let from = '';
    const address = await getCurrentLocationAddress();
    if (address) {
      from = address;
    }
    setForm({ ...EMPTY_BOOKING_FORM, from });
    setCustomers([]);
    setPendingBooking(null);
    setQuoteFares(null);
    setIsCalculatingQuote(false);
  }, []);

  useEffect(() => {
    void initializeHomeForm();
  }, [initializeHomeForm]);

  const updateForm = useCallback((patch: Partial<BookingFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const goToEstimate = useCallback(async () => {
    const trimmed = {
      customerName: form.customerName.trim(),
      contactNumber: form.contactNumber.trim(),
      email: form.email.trim(),
      from: form.from.trim(),
      roomNo: form.roomNo.trim(),
      passengers: parsePassengerCount(form.passengers),
      via: form.via.trim(),
      to: form.to.trim(),
      preferredPickupAt:
        form.preferredPickupAt.trim() || getDefaultPickupDate().toISOString(),
    };

    if (
      !trimmed.customerName ||
      !trimmed.contactNumber ||
      !trimmed.from ||
      !trimmed.to
    ) {
      Alert.alert(
        'Missing details',
        'Please enter your name, contact number, and journey from/to locations.',
      );
      return;
    }

    if (!trimmed.email || !isValidEmail(trimmed.email)) {
      Alert.alert('Email required', 'Please enter a valid email address.');
      return;
    }

    if (trimmed.passengers === null) {
      Alert.alert(
        'Invalid passengers',
        'Please enter a number of passengers between 1 and 8.',
      );
      return;
    }

    const vehicleType: VehicleType = 'executive';
    const booking: BookingDetails = {
      id: createLocalId(),
      bookingRef: '',
      ...trimmed,
      passengers: trimmed.passengers,
      distanceMiles: 0,
      distanceKm: 0,
      vehicleType,
      estimatedFare: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    setQuoteFares(null);
    setPendingBooking(booking);
    setScreen('estimate');
    setIsCalculatingQuote(true);

    try {
      const quote = await fetchRouteQuote({
        from: trimmed.from,
        to: trimmed.to,
        via: isMeaningfulVia(trimmed.via) ? trimmed.via : undefined,
        vehicleType,
      });

      setQuoteFares(quote.fares);
      setPendingBooking((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          distanceMiles: quote.distanceMiles,
          distanceKm: quote.distanceKm,
          durationMinutes: quote.durationMinutes,
          vehicleType,
          estimatedFare: quote.fares[vehicleType],
        };
      });
    } catch (error) {
      Alert.alert('Estimate failed', formatApiErrorMessage(error));
      setPendingBooking(null);
      setQuoteFares(null);
      setScreen('home');
    } finally {
      setIsCalculatingQuote(false);
    }
  }, [form]);

  const goToReview = useCallback(() => {
    if (!pendingBooking || isCalculatingQuote) return;
    if (pendingBooking.distanceMiles <= 0) {
      Alert.alert(
        'Estimate required',
        'Please wait for the route estimate to finish calculating.',
      );
      return;
    }
    setScreen('review');
  }, [pendingBooking, isCalculatingQuote]);

  const goBackToEstimate = useCallback(() => {
    setScreen('estimate');
  }, []);

  const goHome = useCallback(() => {
    setSubmittedBooking(null);
    setIsCalculatingQuote(false);
    setScreen('home');
  }, []);

  const goHomeAndClearCache = useCallback(async () => {
    await initializeHomeForm();
    setSubmittedBooking(null);
    setScreen('home');
  }, [initializeHomeForm]);

  const updatePendingVehicle = useCallback((vehicleType: VehicleType) => {
    setPendingBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vehicleType,
        estimatedFare:
          quoteFares?.[vehicleType] ??
          calculateFare(prev.distanceMiles, vehicleType),
      };
    });
  }, [quoteFares]);

  const submitBookingRequest = useCallback(async () => {
    if (!pendingBooking || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const submitted = await createBookingOnApi({
        customerName: pendingBooking.customerName,
        email: pendingBooking.email,
        contactNumber: pendingBooking.contactNumber,
        from: pendingBooking.from,
        roomNo: pendingBooking.roomNo?.trim() || undefined,
        passengers: pendingBooking.passengers,
        to: pendingBooking.to,
        via: isMeaningfulVia(pendingBooking.via) ? pendingBooking.via : 'car',
        distanceMiles: Math.round(pendingBooking.distanceMiles),
        estimatedFare: Math.round(pendingBooking.estimatedFare),
        vehicleType: pendingBooking.vehicleType,
        preferredPickupAt: pendingBooking.preferredPickupAt,
        submittedAt: new Date().toISOString(),
      });

      await saveCustomerBooking(submitted);
      setSubmittedBooking(submitted);
      setPendingBooking(null);
      setScreen('status');

      const savedCustomers = await getStoredCustomers();
      setCustomers(savedCustomers);
    } catch (error) {
      Alert.alert('Booking failed', formatApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }, [pendingBooking, isSubmitting]);

  const value = useMemo(
    () => ({
      screen,
      form,
      pendingBooking,
      submittedBooking,
      isCheckingAvailability,
      isSubmitting,
      isCalculatingQuote,
      quoteFares,
      customers,
      updateForm,
      goToEstimate,
      goToReview,
      goBackToEstimate,
      goHome,
      goHomeAndClearCache,
      updatePendingVehicle,
      submitBookingRequest,
      startSplashDismissed,
      dismissStartSplash,
    }),
    [
      screen,
      form,
      pendingBooking,
      submittedBooking,
      isCheckingAvailability,
      isSubmitting,
      isCalculatingQuote,
      quoteFares,
      customers,
      updateForm,
      goToEstimate,
      goToReview,
      goBackToEstimate,
      goHome,
      goHomeAndClearCache,
      updatePendingVehicle,
      submitBookingRequest,
      startSplashDismissed,
      dismissStartSplash,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return ctx;
}
