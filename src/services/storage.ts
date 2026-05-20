import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookingDetails, BookingFormData, EMPTY_BOOKING_FORM } from '../types/booking';

const CUSTOMERS_KEY = '@vec_customers';
const LAST_BOOKING_KEY = '@vec_last_booking';

function normalizeBooking(item: Partial<BookingDetails>): BookingDetails {
  return {
    id: item.id ?? '',
    bookingRef: item.bookingRef ?? item.id?.slice(0, 12).toUpperCase() ?? '',
    customerName: item.customerName ?? '',
    contactNumber: item.contactNumber ?? '',
    email: item.email ?? '',
    from: item.from ?? '',
    via: item.via ?? '',
    to: item.to ?? '',
    preferredPickupAt:
      item.preferredPickupAt ??
      (item as { preferredTime?: string }).preferredTime ??
      '',
    distanceMiles: item.distanceMiles ?? 0,
    vehicleType: item.vehicleType ?? 'executive',
    estimatedFare: item.estimatedFare ?? 0,
    status: item.status ?? 'pending',
    createdAt: item.createdAt ?? new Date().toISOString(),
    submittedAt: item.submittedAt,
    resolvedAt: item.resolvedAt,
  };
}

export async function getStoredCustomers(): Promise<BookingDetails[]> {
  try {
    const raw = await AsyncStorage.getItem(CUSTOMERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<BookingDetails>[];
    return Array.isArray(parsed) ? parsed.map(normalizeBooking) : [];
  } catch {
    return [];
  }
}

export async function saveCustomerBooking(booking: BookingDetails): Promise<void> {
  const existing = await getStoredCustomers();
  const updated = [booking, ...existing.filter((item) => item.id !== booking.id)];
  await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
}

export async function updateCustomerBooking(
  bookingId: string,
  patch: Partial<BookingDetails>,
): Promise<BookingDetails | null> {
  const existing = await getStoredCustomers();
  let updatedBooking: BookingDetails | null = null;
  const updated = existing.map((item) => {
    if (item.id !== bookingId) return item;
    updatedBooking = { ...item, ...patch };
    return updatedBooking;
  });
  if (!updatedBooking) return null;
  await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify(updated));
  return updatedBooking;
}

export async function getLastBookingForm(): Promise<BookingFormData> {
  try {
    const raw = await AsyncStorage.getItem(LAST_BOOKING_KEY);
    if (!raw) return { ...EMPTY_BOOKING_FORM };
    return { ...EMPTY_BOOKING_FORM, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_BOOKING_FORM };
  }
}

export async function saveLastBookingForm(form: BookingFormData): Promise<void> {
  await AsyncStorage.setItem(LAST_BOOKING_KEY, JSON.stringify(form));
}

export async function clearBookingCache(): Promise<void> {
  await AsyncStorage.multiRemove([LAST_BOOKING_KEY, CUSTOMERS_KEY]);
}
