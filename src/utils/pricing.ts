import { VehicleType } from '../types/booking';

export const PRICING = {
  saloon: {
    label: 'SALOON',
    firstMiles: 3,
    firstRate: 5,
    additionalRate: 3,
    description: 'First 3 miles at £5/mile, then £3/mile',
  },
  executive: {
    label: 'EXECUTIVE',
    perMile: 5,
    description: '£5 per mile',
  },
  mpv: {
    label: 'MPV (8 Seater)',
    multiplier: 1.5,
    description: '1.5× Executive rate (£7.50/mile)',
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
  return calculateExecutiveFare(miles) * PRICING.mpv.multiplier;
}

/** Whole pounds (API stores `estimatedFare` as an integer). */
export function calculateFare(miles: number, vehicleType: VehicleType): number {
  const roundedMiles = Math.max(0, miles);
  let fare = 0;
  switch (vehicleType) {
    case 'saloon':
      fare = calculateSaloonFare(roundedMiles);
      break;
    case 'executive':
      fare = calculateExecutiveFare(roundedMiles);
      break;
    case 'mpv':
      fare = calculateMpvFare(roundedMiles);
      break;
    default:
      fare = 0;
  }
  return Math.round(fare);
}

export function formatGBP(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

export function getVehicleLabel(vehicleType: VehicleType): string {
  return PRICING[vehicleType].label;
}
