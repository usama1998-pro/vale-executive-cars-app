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
import {
  clearBookingCache,
  getLastBookingForm,
  getStoredCustomers,
  saveCustomerBooking,
  saveLastBookingForm,
} from '../services/storage';
import {
  BookingDetails,
  BookingFormData,
  EMPTY_BOOKING_FORM,
  VehicleType,
} from '../types/booking';
import { getDefaultPickupDate } from '../utils/dateTime';
import { formatApiErrorMessage } from '../lib/apiErrors';
import { getCurrentLocationAddress } from '../utils/location';
import { calculateFare } from '../utils/pricing';

export type AppScreen = 'home' | 'estimate' | 'review' | 'status';

type BookingContextValue = {
  screen: AppScreen;
  form: BookingFormData;
  pendingBooking: BookingDetails | null;
  submittedBooking: BookingDetails | null;
  isCheckingAvailability: boolean;
  isSubmitting: boolean;
  customers: BookingDetails[];
  updateForm: (patch: Partial<BookingFormData>) => void;
  goToEstimate: () => Promise<void>;
  goToReview: () => void;
  goBackToEstimate: () => void;
  goHome: () => void;
  goHomeAndClearCache: () => Promise<void>;
  updatePendingMiles: (miles: number) => void;
  updatePendingVehicle: (vehicle: VehicleType) => void;
  submitBookingRequest: () => Promise<void>;
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

  useEffect(() => {
    (async () => {
      const [savedForm, savedCustomers] = await Promise.all([
        getLastBookingForm(),
        getStoredCustomers(),
      ]);

      let from = savedForm.from;
      if (!from.trim()) {
        const address = await getCurrentLocationAddress();
        if (address) {
          from = address;
        }
      }

      setForm({ ...savedForm, from });
      setCustomers(savedCustomers);
    })();
  }, []);

  const updateForm = useCallback((patch: Partial<BookingFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const goToEstimate = useCallback(async () => {
    const trimmed = {
      customerName: form.customerName.trim(),
      contactNumber: form.contactNumber.trim(),
      email: form.email.trim(),
      from: form.from.trim(),
      via: form.via.trim() || 'car',
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

    await saveLastBookingForm({ ...form, ...trimmed });

    const defaultMiles = 5;
    const vehicleType: VehicleType = 'executive';
    const booking: BookingDetails = {
      id: createLocalId(),
      bookingRef: '',
      ...trimmed,
      distanceMiles: defaultMiles,
      vehicleType,
      estimatedFare: calculateFare(defaultMiles, vehicleType),
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    setPendingBooking(booking);
    setScreen('estimate');
  }, [form]);

  const goToReview = useCallback(() => {
    if (!pendingBooking) return;
    if (pendingBooking.distanceMiles <= 0) {
      Alert.alert('Distance required', 'Please enter the journey distance in miles.');
      return;
    }
    setScreen('review');
  }, [pendingBooking]);

  const goBackToEstimate = useCallback(() => {
    setScreen('estimate');
  }, []);

  const goHome = useCallback(() => {
    setPendingBooking(null);
    setSubmittedBooking(null);
    setScreen('home');
  }, []);

  const goHomeAndClearCache = useCallback(async () => {
    await clearBookingCache();
    setForm(EMPTY_BOOKING_FORM);
    setCustomers([]);
    setPendingBooking(null);
    setSubmittedBooking(null);
    setScreen('home');
  }, []);

  const updatePendingMiles = useCallback((miles: number) => {
    setPendingBooking((prev) => {
      if (!prev) return prev;
      const distanceMiles = Math.max(0, miles);
      return {
        ...prev,
        distanceMiles,
        estimatedFare: calculateFare(distanceMiles, prev.vehicleType),
      };
    });
  }, []);

  const updatePendingVehicle = useCallback((vehicleType: VehicleType) => {
    setPendingBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        vehicleType,
        estimatedFare: calculateFare(prev.distanceMiles, vehicleType),
      };
    });
  }, []);

  const submitBookingRequest = useCallback(async () => {
    if (!pendingBooking || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const submitted = await createBookingOnApi({
        customerName: pendingBooking.customerName,
        email: pendingBooking.email,
        contactNumber: pendingBooking.contactNumber,
        from: pendingBooking.from,
        to: pendingBooking.to,
        via: pendingBooking.via || 'car',
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
      customers,
      updateForm,
      goToEstimate,
      goToReview,
      goBackToEstimate,
      goHome,
      goHomeAndClearCache,
      updatePendingMiles,
      updatePendingVehicle,
      submitBookingRequest,
    }),
    [
      screen,
      form,
      pendingBooking,
      submittedBooking,
      isCheckingAvailability,
      isSubmitting,
      customers,
      updateForm,
      goToEstimate,
      goToReview,
      goBackToEstimate,
      goHome,
      goHomeAndClearCache,
      updatePendingMiles,
      updatePendingVehicle,
      submitBookingRequest,
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
