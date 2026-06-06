/**
 * Local address suggestions for booking forms.
 * Uses a fixed UK list only — no GPS, IP, or remote geocoding.
 */

const POPULAR_LOCATIONS = [
  'London Heathrow Airport (LHR)',
  'London Gatwick Airport (LGW)',
  'London Stansted Airport (STN)',
  'London Luton Airport (LTN)',
  'London City Airport (LCY)',
  'Birmingham Airport (BHX)',
  'Manchester Airport (MAN)',
  'London Paddington Station',
  'London Kings Cross Station',
  'London Victoria Station',
  'London Liverpool Street Station',
  'Birmingham New Street Station',
  'Manchester Piccadilly Station',
  'Oxford',
  'Cambridge',
  'Reading',
  'Slough',
  'Windsor',
  'Ascot',
  'Henley-on-Thames',
  'Marlow',
  'Maidenhead',
  'Bracknell',
  'Wokingham',
  'Newbury',
  'Basingstoke',
  'Guildford',
  'Woking',
  'Staines-upon-Thames',
  'Egham',
  'Virginia Water',
] as const;

const MAX_RESULTS = 10;

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

export function searchLocations(query: string): string[] {
  const normalized = normalizeQuery(query);

  if (!normalized) {
    return [...POPULAR_LOCATIONS].slice(0, MAX_RESULTS);
  }

  return POPULAR_LOCATIONS.filter((location) =>
    location.toLowerCase().includes(normalized),
  ).slice(0, MAX_RESULTS);
}
