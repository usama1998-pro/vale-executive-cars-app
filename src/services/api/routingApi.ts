import { VehicleType } from '../../types/booking';
import { apiPostJson } from './apiFetch';
import { ApiSuccessEnvelope, unwrapApiData } from './apiTypes';

export type GeocodedPoint = {
  address: string;
  latitude: number;
  longitude: number;
};

export type RouteQuoteResponse = {
  from: GeocodedPoint;
  to: GeocodedPoint;
  via?: GeocodedPoint;
  distanceMeters: number;
  distanceKm: number;
  distanceMiles: number;
  durationSeconds: number;
  durationMinutes: number;
  vehicleType: VehicleType;
  estimatedFare: number;
  fares: Record<VehicleType, number>;
};

export type RouteQuotePayload = {
  from: string;
  to: string;
  via?: string;
  vehicleType: VehicleType;
};

export async function fetchRouteQuote(
  payload: RouteQuotePayload,
): Promise<RouteQuoteResponse> {
  const body = await apiPostJson<ApiSuccessEnvelope<RouteQuoteResponse>>(
    '/routing/quote',
    payload,
  );
  return unwrapApiData(body);
}
