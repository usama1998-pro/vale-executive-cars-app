import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { checkOperatorAvailability } from '../services/bookingRequest';
import {
  saveBookingToFirestore,
  updateBookingInFirestore,
} from '../services/firebaseBookings';
import {
  clearBookingCache,
  getLastBookingForm,
  getStoredCustomers,
  saveCustomerBooking,
  saveLastBookingForm,
  updateCustomerBooking,
} from '../services/storage';
import {
  BookingDetails,
  BookingFormData,
  EMPTY_BOOKING_FORM,
  VehicleType,
} from '../types/booking';
import { createBookingRef } from '../utils/bookingRef';
import { calculateFare } from '../utils/pricing';

export type AppScreen = 'home' | 'estimate' | 'review' | 'status';

type BookingContextValue = {
  screen: AppScreen;
  form: BookingFormData;
  pendingBooking: BookingDetails | null;
  submittedBooking: BookingDetails | null;
  isCheckingAvailability: boolean;
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

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [form, setForm] = useState<BookingFormData>(EMPTY_BOOKING_FORM);
  const [pendingBooking, setPendingBooking] = useState<BookingDetails | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingDetails | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [customers, setCustomers] = useState<BookingDetails[]>([]);
  const checkAbortRef = useRef(false);

  useEffect(() => {
    (async () => {
      const [savedForm, savedCustomers] = await Promise.all([
        getLastBookingForm(),
        getStoredCustomers(),
      ]);
      setForm(savedForm);
      setCustomers(savedCustomers);
    })();
  }, []);

  useEffect(() => {
    return () => {
      checkAbortRef.current = true;
    };
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
      via: form.via.trim(),
      to: form.to.trim(),
      preferredPickupAt: form.preferredPickupAt,
    };

    if (!trimmed.customerName || !trimmed.contactNumber || !trimmed.from || !trimmed.to) {
      Alert.alert(
        'Missing details',
        'Please enter your name, contact number, and journey from/to locations.',
      );
      return;
    }

    await saveLastBookingForm({ ...form, ...trimmed });

    const defaultMiles = 5;
    const vehicleType: VehicleType = 'executive';
    const booking: BookingDetails = {
      id: createId(),
      bookingRef: createBookingRef(),
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
    checkAbortRef.current = true;
    setIsCheckingAvailability(false);
    setPendingBooking(null);
    setSubmittedBooking(null);
    setScreen('home');
  }, []);

  const goHomeAndClearCache = useCallback(async () => {
    checkAbortRef.current = true;
    setIsCheckingAvailability(false);
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

  const runAvailabilityCheck = useCallback(async (booking: BookingDetails) => {
    checkAbortRef.current = false;
    setIsCheckingAvailability(true);

    const result = await checkOperatorAvailability(booking);
    if (checkAbortRef.current) return;

    const resolvedAt = new Date().toISOString();
    const updated = await updateCustomerBooking(booking.id, {
      status: result,
      resolvedAt,
    });

    if (updated) {
      setSubmittedBooking(updated);
      const savedCustomers = await getStoredCustomers();
      setCustomers(savedCustomers);
      try {
        await updateBookingInFirestore(booking.id, {
          status: result,
          resolvedAt,
        });
      } catch {
        // Local status is updated; cloud sync can be retried from console if needed.
      }
    }

    setIsCheckingAvailability(false);
  }, []);

  const submitBookingRequest = useCallback(async () => {
    if (!pendingBooking) return;

    const submitted: BookingDetails = {
      ...pendingBooking,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    try {
      await saveBookingToFirestore(submitted);
    } catch {
      Alert.alert(
        'Cloud sync issue',
        'Your booking was saved on this device but could not be sent to Firebase. Please check your internet connection.',
      );
    }

    await saveCustomerBooking(submitted);
    setSubmittedBooking(submitted);
    setPendingBooking(null);
    setScreen('status');

    const savedCustomers = await getStoredCustomers();
    setCustomers(savedCustomers);

    runAvailabilityCheck(submitted);
  }, [pendingBooking, runAvailabilityCheck]);

  const value = useMemo(
    () => ({
      screen,
      form,
      pendingBooking,
      submittedBooking,
      isCheckingAvailability,
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
