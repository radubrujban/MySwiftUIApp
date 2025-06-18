export interface AirportCoordinates {
  icao: string;
  latitude: number;
  longitude: number;
  name: string;
  city?: string;
  country?: string;
  similarity?: number;
}

export function calculateFlightDistance(
  fromIcao: string,
  toIcao: string,
  airports: AirportCoordinates[]
): number | null {
  const fromAirport = airports.find(airport => airport.icao.toLowerCase() === fromIcao.toLowerCase());
  const toAirport = airports.find(airport => airport.icao.toLowerCase() === toIcao.toLowerCase());
  
  if (!fromAirport || !toAirport) {
    return null;
  }
  
  const R = 3440; // Earth radius in nautical miles
  const dLat = toRadians(toAirport.latitude - fromAirport.latitude);
  const dLon = toRadians(toAirport.longitude - fromAirport.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromAirport.latitude)) *
      Math.cos(toRadians(toAirport.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function fuzzySearchIcao(searchTerm: string, airports: AirportCoordinates[]): AirportCoordinates[] {
  return airports.filter(airport => 
    airport.icao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    airport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}