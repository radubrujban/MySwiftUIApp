import { create } from "zustand";

interface FlightLeg {
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

interface Mission {
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
}

interface MissionStats {
  totalMissions: number;
  totalLegs: number;
  totalPax: number;
  totalCargo: number;
  totalFlightHours: number;
  inProgress: number;
  completed: number;
  planning: number;
  uniqueAircraft: number;
}

interface MissionStore {
  missions: Mission[];
  stats: MissionStats;
  isLoading: boolean;
  
  // Actions
  setMissions: (missions: Mission[]) => void;
  updateMission: (id: number, updates: Partial<Mission>) => void;
  addMission: (mission: Mission) => void;
  deleteMission: (id: number) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  calculateStats: () => void;
  fetchMissions: () => Promise<void>;
}

const calculateMissionStats = (missions: Mission[]): MissionStats => {
  return {
    totalMissions: missions.length,
    totalLegs: missions.reduce((acc: number, mission: Mission) => acc + mission.legs, 0),
    totalPax: missions.reduce((acc: number, mission: Mission) => acc + mission.pax, 0),
    totalCargo: missions.reduce((acc: number, mission: Mission) => acc + mission.cargo, 0),
    totalFlightHours: missions.reduce((acc: number, mission: Mission) => acc + (mission.totalFlightHours || 0), 0),
    inProgress: missions.filter((m: Mission) => m.status === "In Progress").length,
    completed: missions.filter((m: Mission) => m.status === "Completed").length,
    planning: missions.filter((m: Mission) => m.status === "Planning").length,
    uniqueAircraft: new Set(missions.map((m: Mission) => m.aircraftType).filter(Boolean)).size
  };
};

export const useMissionStore = create<MissionStore>((set, get) => ({
  missions: [],
  stats: {
    totalMissions: 0,
    totalLegs: 0,
    totalPax: 0,
    totalCargo: 0,
    totalFlightHours: 0,
    inProgress: 0,
    completed: 0,
    planning: 0,
    uniqueAircraft: 0
  },
  isLoading: false,

  setMissions: (missions: Mission[]) => {
    const stats = calculateMissionStats(missions);
    set({ missions, stats });
  },

  updateMission: (id: number, updates: Partial<Mission>) => {
    const missions = get().missions.map(mission =>
      mission.id === id ? { ...mission, ...updates } : mission
    );
    const stats = calculateMissionStats(missions);
    set({ missions, stats });
  },

  addMission: (mission: Mission) => {
    const missions = [...get().missions, mission];
    const stats = calculateMissionStats(missions);
    set({ missions, stats });
  },

  deleteMission: async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/missions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const missions = get().missions.filter(mission => mission.id !== id);
        const stats = calculateMissionStats(missions);
        set({ missions, stats });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting mission:', error);
      return false;
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  calculateStats: () => {
    const missions = get().missions;
    const stats = calculateMissionStats(missions);
    set({ stats });
  },

  fetchMissions: async () => {
    try {
      set({ isLoading: true });
      
      // Always fetch from API as the source of truth
      const response = await fetch('/api/missions');
      if (response.ok) {
        const apiMissions = await response.json();
        // Convert API missions to our format
        const missions = apiMissions.map((m: any) => ({
          id: m.id,
          missionNumber: m.name || `AMC-${m.id}`,
          missionType: m.type || 'TDY',
          status: m.status || 'Planning',
          dateRange: m.startDate && m.endDate 
            ? `${new Date(m.startDate).toLocaleDateString()} - ${new Date(m.endDate).toLocaleDateString()}`
            : 'TBD',
          legs: m.legs?.length || 0,
          pax: m.legs?.reduce((acc: number, leg: any) => acc + (leg.pax || 0), 0) || 0,
          cargo: m.legs?.reduce((acc: number, leg: any) => acc + (leg.cargoWeight || 0), 0) || 0,
          aircraftType: m.legs?.[0]?.aircraftType || undefined,
          createdAt: m.createdAt || new Date().toISOString(),
          flightLegs: m.legs?.map((leg: any) => ({
            id: leg.id?.toString() || `leg-${Date.now()}`,
            legNumber: leg.id || 1,
            departure: leg.departureIcao || '',
            arrival: leg.arrivalIcao || '',
            departureTime: leg.departureTime || '',
            arrivalTime: leg.arrivalTime || '',
            flightHours: leg.flightHours || 0,
            distanceNm: leg.distanceNm || 0,
            tailNumber: leg.tailNumber || '',
            remarks: leg.specialHandling || '',
            pax: leg.pax || 0,
            cargo: leg.cargoWeight || 0
          })) || [],
          totalFlightHours: m.legs?.reduce((acc: number, leg: any) => acc + (leg.flightHours || 0), 0) || 0,
        }));
        
        const stats = calculateMissionStats(missions);
        set({ missions, stats, isLoading: false });
        return;
      } else {
        throw new Error('Failed to fetch missions');
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
      // Set empty state if API fails
      set({ missions: [], stats: calculateMissionStats([]), isLoading: false });
    }
  }
}));

// Listen for mission updates globally
if (typeof window !== 'undefined') {
  window.addEventListener('mission-updated', () => {
    useMissionStore.getState().fetchMissions();
  });
}