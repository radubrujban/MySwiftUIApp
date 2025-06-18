export interface FlightLeg {
  id: string;
  legNumber: number;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  flightHours: number;
  distanceNm?: number;
  tailNumber?: string;
  remarks?: string;
  pax?: number;
  cargo?: number;
}

export interface Mission {
  id: number;
  missionNumber: string;
  missionType: string;
  status: "In Progress" | "Completed" | "Deployment" | "Planning";
  dateRange: string;
  legs: number;
  pax: number;
  cargo: number;
  aircraftType?: string;
  createdAt: string;
  photos?: string[];
  notes?: string;
  flightLegs?: FlightLeg[];
  totalFlightHours?: number;
  crewInfo?: CrewInfo;
}

export interface FCCMember {
  id: string;
  name: string;
  rank: string;
  employeeNumber: string;
  sdap: boolean;
  megp: boolean;
  departureDate: string;
  returnDate: string;
  distinguishedVisitors: string;
}

export interface MaintenancePersonnel {
  id: string;
  name: string;
  rank: string;
  employeeNumber: string;
  sdap: boolean;
  megp: boolean;
  departureDate: string;
  returnDate: string;
  fccMonitor: string;
}

export interface AircraftCommander {
  name: string;
  rank: string;
  flyingSquadron: string;
}

export interface CrewInfo {
  fccMembers: FCCMember[];
  maintenancePersonnel: MaintenancePersonnel[];
  aircraftCommander: AircraftCommander;
}

export interface Airport {
  icao: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  similarity?: number;
}

export interface FlightStatistics {
  totalFlightHours: number;
  totalDistanceNm: number;
  totalCargoMoved: number;
  totalPaxMoved: number;
  missionsCompleted: number;
  averageFlightHours: number;
  longestFlight: number;
  mostFrequentRoute: string;
}