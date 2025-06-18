import { nanoid } from 'nanoid';

export interface MissionLog {
  id: string;
  missionNumber: string;
  timestamp: Date;
  type: 'CREATED' | 'UPDATED' | 'COMPLETED' | 'CANCELLED' | 'STATUS_CHANGE';
  details: string;
  userId: string;
  data?: any;
  scanData?: any;
  extractedText?: string;
  confidence?: number;
}

export interface FlightScore {
  missionId: string;
  onTimeScore: number; // 0-100
  cargoEfficiency: number; // 0-100
  fuelEfficiency: number; // 0-100
  safetyScore: number; // 0-100
  overallScore: number; // 0-100
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  totalMissions: number;
  totalFlightHours: number;
  averageScore: number;
  rank: string;
  achievements: string[];
  createdAt: Date;
}

class MissionTracker {
  private missionLogs: MissionLog[] = [];
  private flightScores: FlightScore[] = [];
  private userProfile: UserProfile | null = null;

  constructor() {
    this.loadFromStorage();
    this.initializeUserProfile();
  }

  private loadFromStorage(): void {
    try {
      const logs = localStorage.getItem('mission_logs');
      if (logs) {
        this.missionLogs = JSON.parse(logs).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
      }

      const scores = localStorage.getItem('flight_scores');
      if (scores) {
        this.flightScores = JSON.parse(scores).map((score: any) => ({
          ...score,
          timestamp: new Date(score.timestamp)
        }));
      }

      const profile = localStorage.getItem('user_profile');
      if (profile) {
        this.userProfile = JSON.parse(profile);
        if (this.userProfile) {
          this.userProfile.createdAt = new Date(this.userProfile.createdAt);
        }
      }
    } catch (error) {
      console.error('Failed to load mission data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('mission_logs', JSON.stringify(this.missionLogs));
      localStorage.setItem('flight_scores', JSON.stringify(this.flightScores));
      if (this.userProfile) {
        localStorage.setItem('user_profile', JSON.stringify(this.userProfile));
      }
    } catch (error) {
      console.error('Failed to save mission data:', error);
    }
  }

  private initializeUserProfile(): void {
    if (!this.userProfile) {
      this.userProfile = {
        id: nanoid(),
        name: localStorage.getItem('user_name') || 'Airman',
        totalMissions: 0,
        totalFlightHours: 0,
        averageScore: 0,
        rank: 'Airman Basic',
        achievements: [],
        createdAt: new Date()
      };
      this.saveToStorage();
    }
  }

  logMissionEvent(type: MissionLog['type'], missionNumber: string, details: string, data?: any): void {
    const log: MissionLog = {
      id: nanoid(),
      missionNumber,
      timestamp: new Date(),
      type,
      details,
      userId: this.userProfile?.id || 'unknown',
      data
    };

    this.missionLogs.unshift(log);
    
    // Keep only last 1000 logs
    if (this.missionLogs.length > 1000) {
      this.missionLogs = this.missionLogs.slice(0, 1000);
    }

    this.saveToStorage();
  }

  logMissionEventWithData(logData: {
    type: MissionLog['type'];
    missionNumber: string;
    details: string;
    scanData?: any;
  }): void {
    const log: MissionLog = {
      id: nanoid(),
      missionNumber: logData.missionNumber,
      timestamp: new Date(),
      type: logData.type,
      details: logData.details,
      userId: this.userProfile?.id || 'unknown',
      data: logData.scanData,
      scanData: logData.scanData,
      extractedText: logData.scanData?.extractedText,
      confidence: logData.scanData?.confidence
    };

    this.missionLogs.unshift(log);
    
    // Keep only last 1000 logs
    if (this.missionLogs.length > 1000) {
      this.missionLogs = this.missionLogs.slice(0, 1000);
    }

    this.saveToStorage();
  }

  recordFlightScore(missionId: string, scores: Omit<FlightScore, 'missionId' | 'timestamp' | 'overallScore'>): void {
    const overallScore = (scores.onTimeScore + scores.cargoEfficiency + scores.fuelEfficiency + scores.safetyScore) / 4;
    
    const flightScore: FlightScore = {
      missionId,
      ...scores,
      overallScore,
      timestamp: new Date()
    };

    this.flightScores.unshift(flightScore);
    this.updateUserProfile();
    this.saveToStorage();
  }

  private updateUserProfile(): void {
    if (!this.userProfile) return;

    const userName = localStorage.getItem('user_name');
    if (userName && userName !== this.userProfile.name) {
      this.userProfile.name = userName;
    }

    this.userProfile.totalMissions = this.missionLogs.filter(log => log.type === 'COMPLETED').length;
    
    // Calculate average score
    if (this.flightScores.length > 0) {
      const totalScore = this.flightScores.reduce((sum, score) => sum + score.overallScore, 0);
      this.userProfile.averageScore = Math.round(totalScore / this.flightScores.length);
    }

    // Update rank based on missions and score
    this.userProfile.rank = this.calculateRank(this.userProfile.totalMissions, this.userProfile.averageScore);
    
    // Award achievements
    this.checkAchievements();
  }

  private calculateRank(missions: number, avgScore: number): string {
    if (missions >= 100 && avgScore >= 95) return 'Chief Master Sergeant';
    if (missions >= 75 && avgScore >= 90) return 'Senior Master Sergeant';
    if (missions >= 50 && avgScore >= 85) return 'Master Sergeant';
    if (missions >= 30 && avgScore >= 80) return 'Technical Sergeant';
    if (missions >= 20 && avgScore >= 75) return 'Staff Sergeant';
    if (missions >= 10 && avgScore >= 70) return 'Senior Airman';
    if (missions >= 5) return 'Airman First Class';
    if (missions >= 1) return 'Airman';
    return 'Airman Basic';
  }

  private checkAchievements(): void {
    if (!this.userProfile) return;

    const achievements = new Set(this.userProfile.achievements);
    
    if (this.userProfile.totalMissions >= 1 && !achievements.has('First Flight')) {
      achievements.add('First Flight');
    }
    
    if (this.userProfile.totalMissions >= 10 && !achievements.has('Veteran Pilot')) {
      achievements.add('Veteran Pilot');
    }
    
    if (this.userProfile.totalMissions >= 50 && !achievements.has('Mission Master')) {
      achievements.add('Mission Master');
    }
    
    if (this.userProfile.averageScore >= 90 && !achievements.has('Excellence Award')) {
      achievements.add('Excellence Award');
    }
    
    const perfectScores = this.flightScores.filter(score => score.overallScore === 100);
    if (perfectScores.length >= 3 && !achievements.has('Perfect Execution')) {
      achievements.add('Perfect Execution');
    }
    
    this.userProfile.achievements = Array.from(achievements);
  }

  getMissionLogs(): MissionLog[] {
    return [...this.missionLogs];
  }

  getFlightScores(): FlightScore[] {
    return [...this.flightScores];
  }

  getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  updateMissionLog(index: number, updatedLog: MissionLog): void {
    if (index >= 0 && index < this.missionLogs.length) {
      this.missionLogs[index] = updatedLog;
      this.saveToStorage();
    }
  }

  deleteMissionLog(index: number): void {
    if (index >= 0 && index < this.missionLogs.length) {
      this.missionLogs.splice(index, 1);
      this.saveToStorage();
      this.updateUserProfile();
    }
  }

  getStatistics() {
    const recentLogs = this.missionLogs.filter(log => 
      log.timestamp.getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000)
    );
    
    const recentScores = this.flightScores.filter(score => 
      score.timestamp.getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000)
    );

    // Count actual completed missions from logs
    const actualMissions = this.missionLogs.filter(log => log.type === 'COMPLETED').length;

    return {
      totalMissions: actualMissions, // Use actual mission count instead of profile value
      recentMissions: recentLogs.length,
      averageScore: this.userProfile?.averageScore || 0,
      recentAverageScore: recentScores.length > 0 
        ? Math.round(recentScores.reduce((sum, score) => sum + score.overallScore, 0) / recentScores.length)
        : 0,
      rank: this.userProfile?.rank || 'Airman Basic',
      achievements: this.userProfile?.achievements || [],
      lastMission: this.missionLogs.length > 0 ? this.missionLogs[0].timestamp : null
    };
  }

  async wipeAllData(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        // Clear all data
        this.missionLogs = [];
        this.flightScores = [];
        this.userProfile = null;
        
        // Clear localStorage
        localStorage.removeItem('mission_logs');
        localStorage.removeItem('flight_scores');
        localStorage.removeItem('user_profile');
        localStorage.removeItem('user_name');
        
        // Reinitialize
        this.initializeUserProfile();
        
        console.log('All mission data wiped successfully');
        resolve(true);
      } catch (error) {
        console.error('Failed to wipe data:', error);
        resolve(false);
      }
    });
  }

  // Generate sample missions for testing
  generateSampleData(): void {
    const sampleMissions = [
      { number: 'AMC-24-001', type: 'Cargo Transport', route: 'KDOV → KBGR' },
      { number: 'AMC-24-002', type: 'Personnel Transport', route: 'KWRI → KBLV' },
      { number: 'AMC-24-003', type: 'Medical Evacuation', route: 'KTCM → PHIK' },
      { number: 'AMC-24-004', type: 'Equipment Delivery', route: 'KPOB → KPSM' },
      { number: 'AMC-24-005', type: 'Training Mission', route: 'KBAF → KDMA' }
    ];

    sampleMissions.forEach((mission, index) => {
      // Create mission logs
      this.logMissionEvent('CREATED', mission.number, `${mission.type} mission created for ${mission.route}`);
      this.logMissionEvent('COMPLETED', mission.number, `Mission ${mission.number} completed successfully`);
      
      // Create flight scores
      this.recordFlightScore(mission.number, {
        onTimeScore: 85 + Math.random() * 15,
        cargoEfficiency: 80 + Math.random() * 20,
        fuelEfficiency: 75 + Math.random() * 25,
        safetyScore: 90 + Math.random() * 10
      });
    });
  }
}

export const missionTracker = new MissionTracker();