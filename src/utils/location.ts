import * as Location from 'expo-location';

const BROAD_REGIONS = new Set([
  'england',
  'scotland',
  'wales',
  'northern ireland',
  'united kingdom',
  'uk',
]);

function getCityName(place: Location.LocationGeocodedAddress): string {
  const candidates = [place.city, place.district, place.subregion, place.name];

  for (const value of candidates) {
    if (!value?.trim()) continue;
    const normalized = value.trim().toLowerCase();
    if (BROAD_REGIONS.has(normalized)) continue;
    return value.trim();
  }

  const region = place.region?.trim();
  if (region && !BROAD_REGIONS.has(region.toLowerCase())) {
    return region;
  }

  return '';
}

async function getCurrentPlace(): Promise<Location.LocationGeocodedAddress | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const results = await Location.reverseGeocodeAsync({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });

  return results[0] ?? null;
}

export async function getCurrentLocationAddress(): Promise<string | null> {
  const place = await getCurrentPlace();
  if (!place) {
    return null;
  }

  const city = getCityName(place);
  if (!city) {
    return null;
  }

  const street = [place.streetNumber, place.street].filter(Boolean).join(' ').trim();
  if (street && street.toLowerCase() !== city.toLowerCase()) {
    return `${street}, ${city}`;
  }

  const placeName = place.name?.trim();
  if (placeName && placeName.toLowerCase() !== city.toLowerCase()) {
    return `${placeName}, ${city}`;
  }

  return city;
}
