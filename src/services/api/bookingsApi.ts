import { BookingDetails, BookingStatus } from '../../types/booking';
import { apiPostJson } from './apiFetch';
import { ApiSuccessEnvelope, unwrapApiData } from './apiTypes';

/** Status values returned by the Nest API. */
type ApiBookingStatus =
  | 'pending'
  | 'submitted'
  | 'accepted'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export type ApiBookingResponse = {
  id: string;
  uuid: string;
  bookingRef: string;
  customerName: string;
  email: string;
  contactNumber: string;
  from: string;
  roomNo?: string;
  passengers?: number;
  note?: string;
  to: string;
  distanceMiles: number;
  estimatedFare: number;
  vehicleType: string;
  tripType?: 'one-way' | 'return';
  preferredPickupAt: string;
  returnPickupAt?: string | null;
  status: ApiBookingStatus;
  submittedAt: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingPayload = {
  customerName: string;
  email: string;
  contactNumber: string;
  from: string;
  roomNo?: string;
  passengers?: number;
  note?: string;
  to: string;
  distanceMiles: number;
  estimatedFare: number;
  vehicleType: string;
  tripType?: 'one-way' | 'return';
  preferredPickupAt: string;
  returnPickupAt?: string;
  submittedAt?: string;
};

function mapApiStatusToApp(status: ApiBookingStatus): BookingStatus {
  switch (status) {
    case 'accepted':
    case 'completed':
      return 'accepted';
    case 'rejected':
    case 'cancelled':
      return 'declined';
    case 'pending':
    case 'submitted':
    default:
      return 'pending';
  }
}

export function mapApiBookingToDetails(row: ApiBookingResponse): BookingDetails {
  return {
    id: row.uuid || row.id,
    bookingRef: row.bookingRef,
    customerName: row.customerName,
    contactNumber: row.contactNumber,
    email: row.email,
    from: row.from,
    roomNo: row.roomNo ?? undefined,
    passengers: row.passengers ?? undefined,
    note: row.note ?? undefined,
    to: row.to,
    preferredPickupAt: row.preferredPickupAt,
    distanceMiles: row.distanceMiles,
    distanceKm: Math.round(row.distanceMiles * 1.609344),
    vehicleType: row.vehicleType as BookingDetails['vehicleType'],
    tripType: row.tripType ?? 'one-way',
    estimatedFare: row.estimatedFare,
    returnPickupAt: row.returnPickupAt ?? undefined,
    status: mapApiStatusToApp(row.status),
    createdAt: row.createdAt,
    submittedAt: row.submittedAt,
    resolvedAt: row.resolvedAt ?? undefined,
  };
}

export async function createBookingOnApi(
  payload: CreateBookingPayload,
): Promise<BookingDetails> {
  const body = await apiPostJson<ApiSuccessEnvelope<ApiBookingResponse>>(
    '/bookings',
    payload,
  );
  const row = unwrapApiData(body);
  return mapApiBookingToDetails(row);
}
