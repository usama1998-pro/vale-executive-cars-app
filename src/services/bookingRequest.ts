import { BookingDetails, BookingStatus } from '../types/booking';

/**
 * Simulates operator availability check until a real backend is connected.
 * Replace with API call when operator workflow is ready.
 */
export async function checkOperatorAvailability(
  booking: BookingDetails,
): Promise<BookingStatus> {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const hash = booking.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return hash % 3 === 0 ? 'declined' : 'accepted';
}
