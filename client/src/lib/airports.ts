// Airport database for ICAO code lookups
// In a production app, this would be a comprehensive database or API

export interface Airport {
  icao: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  runwayLength: number; // feet
  elevation: number; // feet
}

const AIRPORT_DATABASE: Record<string, Airport> = {
  "KTCM": {
    icao: "KTCM",
    name: "McChord Air Force Base",
    city: "Tacoma",
    country: "United States"
  },
  "ETAR": {
    icao: "ETAR",
    name: "Ramstein Air Base",
    city: "Ramstein",
    country: "Germany"
  },
  "BGHR": {
    icao: "BGHR",
    name: "Thule Air Base",
    city: "Thule",
    country: "Greenland"
  },
  "KOFF": {
    icao: "KOFF",
    name: "Offutt Air Force Base",
    city: "Omaha",
    country: "United States"
  },
  "PHIK": {
    icao: "PHIK",
    name: "Hickam Air Force Base",
    city: "Honolulu",
    country: "United States"
  },
  "PGUA": {
    icao: "PGUA",
    name: "Andersen Air Force Base",
    city: "Yigo",
    country: "Guam"
  },
  "OKAS": {
    icao: "OKAS",
    name: "Al Asad Air Base",
    city: "Al Anbar",
    country: "Iraq"
  },
  "OKBK": {
    icao: "OKBK",
    name: "Ali Al Salem Air Base",
    city: "Jahra",
    country: "Kuwait"
  },
  "OTBH": {
    icao: "OTBH",
    name: "Al Udeid Air Base",
    city: "Doha",
    country: "Qatar"
  },
  "OEJN": {
    icao: "OEJN",
    name: "King Abdulaziz Air Base",
    city: "Jeddah",
    country: "Saudi Arabia"
  },
  "LTAG": {
    icao: "LTAG",
    name: "Incirlik Air Base",
    city: "Adana",
    country: "Turkey"
  },
  "EDDK": {
    icao: "EDDK",
    name: "Cologne Bonn Airport",
    city: "Cologne",
    country: "Germany"
  },
  "LERT": {
    icao: "LERT",
    name: "Souda Bay",
    city: "Chania",
    country: "Greece"
  }
};

export function getAirportByIcao(icao: string): Airport | undefined {
  return AIRPORT_DATABASE[icao.toUpperCase()];
}

export function searchAirports(query: string): Airport[] {
  const searchTerm = query.toLowerCase();
  return Object.values(AIRPORT_DATABASE).filter(airport => 
    airport.icao.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm) ||
    airport.city.toLowerCase().includes(searchTerm)
  );
}

export function validateIcaoCode(icao: string): boolean {
  return icao.length === 4 && /^[A-Z]{4}$/.test(icao.toUpperCase());
}
