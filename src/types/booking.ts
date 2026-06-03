export type VehicleType = 'saloon' | 'executive' | 'mpv';

export type BookingStatus = 'draft' | 'pending' | 'accepted' | 'declined';

export type BookingDetails = {
  id: string;
  bookingRef: string;
  customerName: string;
  contactNumber: string;
  email: string;
  from: string;
  via: string;
  to: string;
  preferredPickupAt: string;
  distanceKm: number;
  /** Legacy API field name; booking API stores km in `distanceMiles`. */
  distanceMiles: number;
  durationMinutes?: number;
  vehicleType: VehicleType;
  estimatedFare: number;
  status: BookingStatus;
  createdAt: string;
  submittedAt?: string;
  resolvedAt?: string;
};

export type BookingFormData = {
  customerName: string;
  contactNumber: string;
  email: string;
  from: string;
  via: string;
  to: string;
  preferredPickupAt: string;
};

export const EMPTY_BOOKING_FORM: BookingFormData = {
  customerName: '',
  contactNumber: '',
  email: '',
  from: '',
  via: '',
  to: '',
  preferredPickupAt: '',
};

export const BOOKING_MESSAGES = {
  pending:
    'Your booking has been submitted successfully. Our team will review your request and be in touch soon.',
  pendingNotice:
    'Please check your WhatsApp and email for your booking confirmation and any updates from us.',
  accepted:
    'Your booking has been accepted. Our team will confirm your journey details with you shortly.',
  declined:
    'Unfortunately, we do not have availability at your preferred time.',
} as const;