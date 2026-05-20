import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BookingDetails } from '../types/booking';

const BOOKINGS_COLLECTION = 'bookings';

function toFirestorePayload(booking: BookingDetails) {
  return {
    bookingRef: booking.bookingRef,
    customerName: booking.customerName,
    contactNumber: booking.contactNumber,
    email: booking.email,
    from: booking.from,
    via: booking.via,
    to: booking.to,
    preferredPickupAt: booking.preferredPickupAt,
    distanceMiles: booking.distanceMiles,
    vehicleType: booking.vehicleType,
    estimatedFare: booking.estimatedFare,
    status: booking.status,
    createdAt: booking.createdAt,
    submittedAt: booking.submittedAt ?? null,
    resolvedAt: booking.resolvedAt ?? null,
    updatedAt: new Date().toISOString(),
  };
}

export async function saveBookingToFirestore(booking: BookingDetails): Promise<void> {
  const ref = doc(db, BOOKINGS_COLLECTION, booking.id);
  await setDoc(ref, toFirestorePayload(booking));
}

export async function updateBookingInFirestore(
  bookingId: string,
  patch: Partial<BookingDetails>,
): Promise<void> {
  const ref = doc(db, BOOKINGS_COLLECTION, bookingId);
  const payload: Record<string, unknown> = { updatedAt: new Date().toISOString() };

  if (patch.bookingRef !== undefined) payload.bookingRef = patch.bookingRef;
  if (patch.customerName !== undefined) payload.customerName = patch.customerName;
  if (patch.contactNumber !== undefined) payload.contactNumber = patch.contactNumber;
  if (patch.email !== undefined) payload.email = patch.email;
  if (patch.from !== undefined) payload.from = patch.from;
  if (patch.via !== undefined) payload.via = patch.via;
  if (patch.to !== undefined) payload.to = patch.to;
  if (patch.preferredPickupAt !== undefined) payload.preferredPickupAt = patch.preferredPickupAt;
  if (patch.distanceMiles !== undefined) payload.distanceMiles = patch.distanceMiles;
  if (patch.vehicleType !== undefined) payload.vehicleType = patch.vehicleType;
  if (patch.estimatedFare !== undefined) payload.estimatedFare = patch.estimatedFare;
  if (patch.status !== undefined) payload.status = patch.status;
  if (patch.createdAt !== undefined) payload.createdAt = patch.createdAt;
  if (patch.submittedAt !== undefined) payload.submittedAt = patch.submittedAt;
  if (patch.resolvedAt !== undefined) payload.resolvedAt = patch.resolvedAt;

  await updateDoc(ref, payload);
}
