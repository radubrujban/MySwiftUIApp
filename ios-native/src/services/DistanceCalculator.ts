import { Airport } from '../types/Mission';

export class DistanceCalculator {
  // Airport database with coordinates
  private static airports: Airport[] = [
    { icao: 'KTCM', name: 'McChord Field', city: 'Tacoma', country: 'United States', latitude: 47.137681, longitude: -122.476428 },
    { icao: 'ETAR', name: 'Ramstein Air Base', city: 'Ramstein', country: 'Germany', latitude: 49.436928, longitude: 7.600278 },
    { icao: 'OKBK', name: 'Ali Al Salem Air Base', city: 'Kuwait', country: 'Kuwait', latitude: 29.346758, longitude: 47.678392 },
    { icao: 'LTAC', name: 'Esenboga Airport', city: 'Ankara', country: 'Turkey', latitude: 40.128081, longitude: 32.995083 },
    { icao: 'KORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'United States', latitude: 41.978603, longitude: -87.904842 },
    { icao: 'KJFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', latitude: 40.639751, longitude: -73.778925 },
    { icao: 'KLAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', latitude: 33.942536, longitude: -118.408075 },
    { icao: 'KIAH', name: 'George Bush Intercontinental Airport', city: 'Houston', country: 'United States', latitude: 29.984433, longitude: -95.341442 },
    { icao: 'KDEN', name: 'Denver International Airport', city: 'Denver', country: 'United States', latitude: 39.861656, longitude: -104.673178 },
    { icao: 'KATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'United States', latitude: 33.636719, longitude: -84.428067 },
    { icao: 'KSEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States', latitude: 47.449, longitude: -122.309306 },
    { icao: 'KPHX', name: 'Phoenix Sky Harbor International Airport', city: 'Phoenix', country: 'United States', latitude: 33.434278, longitude: -112.011583 },
    { icao: 'KLAS', name: 'McCarran International Airport', city: 'Las Vegas', country: 'United States', latitude: 36.080056, longitude: -115.15225 },
    { icao: 'KMIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', latitude: 25.79325, longitude: -80.290556 },
    { icao: 'KBOS', name: 'Logan International Airport', city: 'Boston', country: 'United States', latitude: 42.364347, longitude: -71.005181 },
    { icao: 'KSFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', latitude: 37.621311, longitude: -122.378967 },
    { icao: 'KDCA', name: 'Ronald Reagan Washington National Airport', city: 'Washington', country: 'United States', latitude: 38.851242, longitude: -77.037697 },
    { icao: 'KIAD', name: 'Washington Dulles International Airport', city: 'Washington', country: 'United States', latitude: 38.944533, longitude: -77.455811 },
    { icao: 'KBWI', name: 'Baltimore/Washington International Thurgood Marshall Airport', city: 'Baltimore', country: 'United States', latitude: 39.175361, longitude: -76.668333 },
    { icao: 'KMDW', name: 'Midway International Airport', city: 'Chicago', country: 'United States', latitude: 41.785972, longitude: -87.752417 },
    { icao: 'KSTL', name: 'Lambert-St. Louis International Airport', city: 'St. Louis', country: 'United States', latitude: 38.748697, longitude: -90.370028 },
    { icao: 'KMSP', name: 'Minneapolis-Saint Paul International Airport', city: 'Minneapolis', country: 'United States', latitude: 44.881956, longitude: -93.221767 },
    { icao: 'KPHL', name: 'Philadelphia International Airport', city: 'Philadelphia', country: 'United States', latitude: 40.071946, longitude: -75.072411 },
    { icao: 'KCLV', name: 'Charlotte Douglas International Airport', city: 'Charlotte', country: 'United States', latitude: 35.214, longitude: -80.943139 },
    { icao: 'KSAN', name: 'San Diego International Airport', city: 'San Diego', country: 'United States', latitude: 32.733556, longitude: -117.189667 },
    { icao: 'KTPA', name: 'Tampa International Airport', city: 'Tampa', country: 'United States', latitude: 27.975472, longitude: -82.533194 },
    { icao: 'KPDX', name: 'Portland International Airport', city: 'Portland', country: 'United States', latitude: 45.588722, longitude: -122.5975 },
    { icao: 'KSAT', name: 'San Antonio International Airport', city: 'San Antonio', country: 'United States', latitude: 29.533694, longitude: -98.469778 },
    { icao: 'KCVG', name: 'Cincinnati/Northern Kentucky International Airport', city: 'Cincinnati', country: 'United States', latitude: 39.048836, longitude: -84.667822 },
    { icao: 'KPIT', name: 'Pittsburgh International Airport', city: 'Pittsburgh', country: 'United States', latitude: 40.491467, longitude: -80.232872 },
    // International airports
    { icao: 'EGLL', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', latitude: 51.4706, longitude: -0.461941 },
    { icao: 'LFPG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', latitude: 49.012779, longitude: 2.55 },
    { icao: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.026421, longitude: 8.543125 },
    { icao: 'LIRF', name: 'Leonardo da Vinci Airport', city: 'Rome', country: 'Italy', latitude: 41.804475, longitude: 12.250797 },
    { icao: 'LEMD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', latitude: 40.471926, longitude: -3.56264 },
    { icao: 'LOWW', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', latitude: 48.110278, longitude: 16.569722 },
    { icao: 'EHAM', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', latitude: 52.308056, longitude: 4.764167 },
    { icao: 'EKCH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', latitude: 55.617917, longitude: 12.656111 },
    { icao: 'ESSA', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden', latitude: 59.651944, longitude: 17.918611 },
    { icao: 'ENGM', name: 'Oslo Airport', city: 'Oslo', country: 'Norway', latitude: 60.193917, longitude: 11.100361 },
    { icao: 'EFHK', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finland', latitude: 60.317222, longitude: 24.963333 },
    // Middle East
    { icao: 'OMDB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', latitude: 25.252778, longitude: 55.364444 },
    { icao: 'OTHH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', latitude: 25.273056, longitude: 51.608056 },
    { icao: 'OERK', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', latitude: 24.957222, longitude: 46.698889 },
    { icao: 'OJAI', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan', latitude: 31.722556, longitude: 35.993214 },
    { icao: 'LTBA', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', latitude: 41.275278, longitude: 28.751944 },
    // Asia Pacific
    { icao: 'RJTT', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', latitude: 35.552222, longitude: 139.779722 },
    { icao: 'RKSI', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', latitude: 37.463333, longitude: 126.440556 },
    { icao: 'VHHH', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', latitude: 22.308919, longitude: 113.914603 },
    { icao: 'WSSS', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', latitude: 1.350189, longitude: 103.994433 },
    { icao: 'YSSY', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', latitude: -33.946667, longitude: 151.177222 },
    { icao: 'YMML', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', latitude: -37.673333, longitude: 144.843333 },
    // Africa
    { icao: 'HECA', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', latitude: 30.121944, longitude: 31.405556 },
    { icao: 'FAOR', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa', latitude: -26.139166, longitude: 28.246 },
    { icao: 'GMMN', name: 'Mohammed V International Airport', city: 'Casablanca', country: 'Morocco', latitude: 33.367222, longitude: -7.589722 },
    // South America
    { icao: 'SBGR', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', latitude: -23.435556, longitude: -46.473056 },
    { icao: 'SAEZ', name: 'Ezeiza International Airport', city: 'Buenos Aires', country: 'Argentina', latitude: -34.822222, longitude: -58.535833 },
    { icao: 'SCEL', name: 'Santiago International Airport', city: 'Santiago', country: 'Chile', latitude: -33.393056, longitude: -70.785833 },
    // Canada
    { icao: 'CYYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', latitude: 43.677222, longitude: -79.630556 },
    { icao: 'CYVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', latitude: 49.194722, longitude: -123.183889 },
    { icao: 'CYUL', name: 'Montréal-Pierre Elliott Trudeau International Airport', city: 'Montreal', country: 'Canada', latitude: 45.470556, longitude: -73.740833 },
    // Military bases
    { icao: 'RJOI', name: 'Yokota Air Base', city: 'Tokyo', country: 'Japan', latitude: 35.748472, longitude: 139.348389 },
    { icao: 'OSAN', name: 'Osan Air Base', city: 'Pyeongtaek', country: 'South Korea', latitude: 37.090833, longitude: 127.029444 },
    { icao: 'LERT', name: 'Thule Air Base', city: 'Thule', country: 'Greenland', latitude: 76.531111, longitude: -68.703056 },
    { icao: 'LIPH', name: 'Aviano Air Base', city: 'Aviano', country: 'Italy', latitude: 46.031944, longitude: 12.596389 },
    { icao: 'EGVA', name: 'RAF Fairford', city: 'Fairford', country: 'United Kingdom', latitude: 51.682222, longitude: -1.790000 },
    { icao: 'EGVN', name: 'RAF Brize Norton', city: 'Carterton', country: 'United Kingdom', latitude: 51.749722, longitude: -1.583611 },
    { icao: 'ETAD', name: 'Spangdahlem Air Base', city: 'Spangdahlem', country: 'Germany', latitude: 49.972778, longitude: 6.692500 },
    { icao: 'ETNT', name: 'Grafenwoehr Army Airfield', city: 'Grafenwoehr', country: 'Germany', latitude: 49.698611, longitude: 11.940278 },
    { icao: 'LICZ', name: 'Sigonella Naval Air Station', city: 'Sigonella', country: 'Italy', latitude: 37.401667, longitude: 14.922222 },
    { icao: 'LGSA', name: 'Souda Air Base', city: 'Souda Bay', country: 'Greece', latitude: 35.492222, longitude: 24.063889 },
    { icao: 'LTAG', name: 'Incirlik Air Base', city: 'Adana', country: 'Turkey', latitude: 37.002389, longitude: 35.425833 },
    { icao: 'OAIX', name: 'Prince Sultan Air Base', city: 'Al Kharj', country: 'Saudi Arabia', latitude: 24.362778, longitude: 47.586111 },
    { icao: 'OAKN', name: 'Kandahar Airfield', city: 'Kandahar', country: 'Afghanistan', latitude: 31.505556, longitude: 65.847778 },
    { icao: 'ORBI', name: 'Balad Air Base', city: 'Balad', country: 'Iraq', latitude: 33.940833, longitude: 44.361944 },
    { icao: 'ORSU', name: 'Sather Air Base', city: 'Baghdad', country: 'Iraq', latitude: 33.262500, longitude: 44.235278 }
  ];

  static findAirport(icao: string): Airport | null {
    return this.airports.find(airport => airport.icao.toUpperCase() === icao.toUpperCase()) || null;
  }

  static searchAirports(query: string): Airport[] {
    const searchTerm = query.toLowerCase();
    
    return this.airports
      .filter(airport => 
        airport.icao.toLowerCase().includes(searchTerm) ||
        airport.name.toLowerCase().includes(searchTerm) ||
        airport.city.toLowerCase().includes(searchTerm)
      )
      .slice(0, 10); // Limit to top 10 results
  }

  static calculateDistance(fromIcao: string, toIcao: string): number | null {
    const fromAirport = this.findAirport(fromIcao);
    const toAirport = this.findAirport(toIcao);

    if (!fromAirport || !toAirport) {
      return null;
    }

    return this.calculateFlightDistance(
      fromAirport.latitude,
      fromAirport.longitude,
      toAirport.latitude,
      toAirport.longitude
    );
  }

  private static calculateFlightDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 3440.065; // Earth's radius in nautical miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance);
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static getAllAirports(): Airport[] {
    return [...this.airports];
  }
}