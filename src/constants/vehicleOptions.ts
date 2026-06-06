import { VehicleType } from '../types/booking';
import { PRICING } from '../utils/pricing';

export type VehicleOptionMeta = {
  type: VehicleType;
  title: string;
  tagline: string;
  lines: string[];
};

export const VEHICLE_OPTIONS: VehicleOptionMeta[] = [
  {
    type: 'saloon',
    title: PRICING.saloon.label,
    tagline: 'Comfortable everyday travel',
    lines: [
      'First 3 miles charged at £5 per mile',
      'Any additional miles charged at £3 per mile',
    ],
  },
  {
    type: 'executive',
    title: PRICING.executive.label,
    tagline: 'Premium ride, business class',
    lines: ['Charged at £5 per mile'],
  },
  {
    type: 'mpv',
    title: PRICING.mpv.label,
    tagline: 'Extra space for groups & luggage',
    lines: ['Charged at 1.5× the Executive rate'],
  },
];

export function getVehicleOption(type: VehicleType): VehicleOptionMeta | undefined {
  return VEHICLE_OPTIONS.find((option) => option.type === type);
}
