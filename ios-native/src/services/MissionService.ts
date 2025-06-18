import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Mission, FlightLeg, FlightStatistics } from '../types/Mission';

export class MissionService {
  private static MISSIONS_KEY = 'amc_missions';
  private static STATISTICS_KEY = 'amc_statistics';

  static async getAllMissions(): Promise<Mission[]> {
    try {
      const missionsJson = await AsyncStorage.getItem(this.MISSIONS_KEY);
      if (missionsJson) {
        return JSON.parse(missionsJson);
      }
      return [];
    } catch (error) {
      console.error('Error loading missions:', error);
      return [];
    }
  }

  static async getMission(id: number): Promise<Mission | null> {
    try {
      const missions = await this.getAllMissions();
      return missions.find(mission => mission.id === id) || null;
    } catch (error) {
      console.error('Error getting mission:', error);
      return null;
    }
  }

  static async saveMission(mission: Mission): Promise<void> {
    try {
      const missions = await this.getAllMissions();
      const existingIndex = missions.findIndex(m => m.id === mission.id);
      
      if (existingIndex >= 0) {
        missions[existingIndex] = mission;
      } else {
        missions.push(mission);
      }
      
      await AsyncStorage.setItem(this.MISSIONS_KEY, JSON.stringify(missions));
    } catch (error) {
      console.error('Error saving mission:', error);
      throw error;
    }
  }

  static async deleteMission(id: number): Promise<void> {
    try {
      const missions = await this.getAllMissions();
      const filteredMissions = missions.filter(mission => mission.id !== id);
      await AsyncStorage.setItem(this.MISSIONS_KEY, JSON.stringify(filteredMissions));
    } catch (error) {
      console.error('Error deleting mission:', error);
      throw error;
    }
  }

  static async getStatistics(): Promise<FlightStatistics> {
    try {
      const statsJson = await AsyncStorage.getItem(this.STATISTICS_KEY);
      if (statsJson) {
        return JSON.parse(statsJson);
      }
      
      // Return default statistics
      return {
        totalFlightHours: 0,
        totalDistanceNm: 0,
        totalCargoMoved: 0,
        totalPaxMoved: 0,
        missionsCompleted: 0,
        averageFlightHours: 0,
        longestFlight: 0,
        mostFrequentRoute: 'None'
      };
    } catch (error) {
      console.error('Error loading statistics:', error);
      return {
        totalFlightHours: 0,
        totalDistanceNm: 0,
        totalCargoMoved: 0,
        totalPaxMoved: 0,
        missionsCompleted: 0,
        averageFlightHours: 0,
        longestFlight: 0,
        mostFrequentRoute: 'None'
      };
    }
  }

  static async updateStatistics(mission: Mission): Promise<void> {
    try {
      const currentStats = await this.getStatistics();
      const missions = await this.getAllMissions();
      
      // Recalculate statistics from all missions
      let totalFlightHours = 0;
      let totalDistanceNm = 0;
      let totalCargoMoved = 0;
      let totalPaxMoved = 0;
      let missionsCompleted = 0;
      let longestFlight = 0;
      const routeFrequency: { [key: string]: number } = {};

      missions.forEach(m => {
        if (m.totalFlightHours) {
          totalFlightHours += m.totalFlightHours;
          longestFlight = Math.max(longestFlight, m.totalFlightHours);
        }
        
        totalCargoMoved += m.cargo || 0;
        totalPaxMoved += m.pax || 0;
        
        if (m.status === 'Completed') {
          missionsCompleted++;
        }

        // Track route frequency
        if (m.flightLegs && m.flightLegs.length > 0) {
          m.flightLegs.forEach(leg => {
            const route = `${leg.departure}-${leg.arrival}`;
            routeFrequency[route] = (routeFrequency[route] || 0) + 1;
            
            if (leg.distanceNm) {
              totalDistanceNm += leg.distanceNm;
            }
          });
        }
      });

      // Find most frequent route
      let mostFrequentRoute = 'None';
      let maxFrequency = 0;
      Object.entries(routeFrequency).forEach(([route, frequency]) => {
        if (frequency > maxFrequency) {
          maxFrequency = frequency;
          mostFrequentRoute = route;
        }
      });

      const averageFlightHours = missionsCompleted > 0 ? totalFlightHours / missionsCompleted : 0;

      const updatedStats: FlightStatistics = {
        totalFlightHours,
        totalDistanceNm,
        totalCargoMoved,
        totalPaxMoved,
        missionsCompleted,
        averageFlightHours,
        longestFlight,
        mostFrequentRoute
      };

      await AsyncStorage.setItem(this.STATISTICS_KEY, JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Error updating statistics:', error);
      throw error;
    }
  }

  static generateId(): number {
    return Date.now();
  }

  static formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  static formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
}