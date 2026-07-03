import { VehicleType } from '../types/booking';

export const PRICING = {
  saloon: {
    label: 'PREMIUM VEHICLE',
    firstMiles: 3,
    firstRate: 7.5,
    additionalRate: 3,
    description: 'First 3 miles at £7.50/mile, then £3/mile',
  },
  executive: {
    label: 'EXECUTIVE VEHICLE',
    perMile: 7.5,
    description: '£7.50 per mile',
  },
  mpv: {
    label: 'EXECUTIVE MPV (7 Seater)',
    firstMiles: 3,
    firstRate: 10,
    additionalRate: 7.5,
    description: 'First 3 miles at £10/mile, then £7.50/mile',
  },
} as const;

export function calculateSaloonFare(miles: number): number {
  if (miles <= 0) return 0;
  if (miles <= PRICING.saloon.firstMiles) {
    return miles * PRICING.saloon.firstRate;
  }
  const firstLeg = PRICING.saloon.firstMiles * PRICING.saloon.firstRate;
  const additional = (miles - PRICING.saloon.firstMiles) * PRICING.saloon.additionalRate;
  return firstLeg + additional;
}

export function calculateExecutiveFare(miles: number): number {
  if (miles <= 0) return 0;
  return miles * PRICING.executive.perMile;
}

export function calculateMpvFare(miles: number): number {
  if (miles <= 0) return 0;
  if (miles <= PRICING.mpv.firstMiles) {
    return miles * PRICING.mpv.firstRate;
  }
  const firstLeg = PRICING.mpv.firstMiles * PRICING.mpv.firstRate;
  const additional = (miles - PRICING.mpv.firstMiles) * PRICING.mpv.additionalRate;
  return firstLeg + additional;
}

/** Fare in pounds to 2 decimal places (exact pence, priced on exact miles). */
export function calculateFare(miles: number, vehicleType: VehicleType): number {
  const exactMiles = Math.max(0, miles);
  let fare = 0;
  switch (vehicleType) {
    case 'saloon':
      fare = calculateSaloonFare(exactMiles);
      break;
    case 'executive':
      fare = calculateExecutiveFare(exactMiles);
      break;
    case 'mpv':
      fare = calculateMpvFare(exactMiles);
      break;
    default:
      fare = 0;
  }
  return Math.round(fare * 100) / 100;
}

export function formatGBP(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

export function getVehicleLabel(vehicleType: VehicleType): string {
  return PRICING[vehicleType].label;
}
