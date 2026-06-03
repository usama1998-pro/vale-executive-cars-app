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
  to: string;
  distanceMiles: number;
  estimatedFare: number;
  vehicleType: string;
  via: string;
  preferredPickupAt: string;
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
  to: string;
  distanceMiles: number;
  estimatedFare: number;
  vehicleType: string;
  via: string;
  preferredPickupAt: string;
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
    via: row.via,
    to: row.to,
    preferredPickupAt: row.preferredPickupAt,
    distanceMiles: row.distanceMiles,
    vehicleType: row.vehicleType as BookingDetails['vehicleType'],
    estimatedFare: row.estimatedFare,
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
