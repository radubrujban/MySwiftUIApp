import {
  users,
  missions,
  flightLegs,
  userProfile,
  aiLearningModels,
  scanFeedback,
  airportVisits,
  type User,
  type UpsertUser,
  type Mission,
  type FlightLeg,
  type UserProfile,
  type InsertMission,
  type InsertFlightLeg,
  type InsertUserProfile,
  type MissionWithLegs,
  type FlightStatistics,
  type AILearningModel,
  type InsertAILearningModel,
  type ScanFeedback,
  type InsertScanFeedback,
  type AirportVisit,
  type InsertAirportVisit,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { encryptSensitiveData, decryptSensitiveData, EncryptionMetadata } from "./encryption";

export interface IStorage {
  // User methods (for authentication)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Mission methods
  getMission(id: number): Promise<Mission | undefined>;
  getMissionWithLegs(id: number): Promise<MissionWithLegs | undefined>;
  getAllMissions(): Promise<Mission[]>;
  getAllMissionsWithLegs(): Promise<MissionWithLegs[]>;
  createMission(mission: InsertMission): Promise<Mission>;
  updateMission(id: number, updates: Partial<InsertMission>): Promise<Mission | undefined>;
  deleteMission(id: number): Promise<boolean>;
  extendMission(id: number, newEndDate: Date, reason: string): Promise<Mission | undefined>;

  // Flight leg methods
  getFlightLeg(id: number): Promise<FlightLeg | undefined>;
  getFlightLegsByMission(missionId: number): Promise<FlightLeg[]>;
  createFlightLeg(leg: InsertFlightLeg): Promise<FlightLeg>;
  updateFlightLeg(id: number, updates: Partial<InsertFlightLeg>): Promise<FlightLeg | undefined>;
  deleteFlightLeg(id: number): Promise<boolean>;

  // User profile methods
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  getFlightStatistics(userId: string): Promise<FlightStatistics>;
  updateFlightStatistics(userId: string, leg: FlightLeg): Promise<void>;

  // AI Learning methods
  getAILearningModel(userId: string): Promise<AILearningModel | undefined>;
  saveAILearningModel(model: InsertAILearningModel): Promise<AILearningModel>;
  saveScanFeedback(feedback: InsertScanFeedback): Promise<ScanFeedback>;

  // Airport visit tracking
  getAirportVisits(userId: string): Promise<AirportVisit[]>;
  updateAirportVisit(userId: string, icao: string, flightData: { hours: number; cargo: number; pax: number }): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for authentication)
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Mission methods with database operations
  async getMission(id: number): Promise<Mission | undefined> {
    const [mission] = await db.select().from(missions).where(eq(missions.id, id));
    return mission;
  }

  async getMissionWithLegs(id: number): Promise<MissionWithLegs | undefined> {
    const [mission] = await db.select().from(missions).where(eq(missions.id, id));
    if (!mission) return undefined;
    
    const legs = await db.select().from(flightLegs).where(eq(flightLegs.missionId, id));
    return { ...mission, legs };
  }

  async getAllMissions(): Promise<Mission[]> {
    return await db.select().from(missions).orderBy(desc(missions.createdAt));
  }

  async getAllMissionsWithLegs(): Promise<MissionWithLegs[]> {
    const allMissions = await db.select().from(missions).orderBy(desc(missions.createdAt));
    const result: MissionWithLegs[] = [];
    
    for (const mission of allMissions) {
      const legs = await db.select().from(flightLegs).where(eq(flightLegs.missionId, mission.id));
      result.push({ ...mission, legs });
    }
    
    return result;
  }

  async createMission(insertMission: InsertMission): Promise<Mission> {
    const [mission] = await db.insert(missions).values(insertMission).returning();
    return mission;
  }

  async updateMission(id: number, updates: Partial<InsertMission>): Promise<Mission | undefined> {
    const [mission] = await db
      .update(missions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(missions.id, id))
      .returning();
    return mission;
  }

  async deleteMission(id: number): Promise<boolean> {
    try {
      console.log(`Storage: Deleting mission ${id}`);
      
      // Delete all associated flight legs first
      const legDeleteResult = await db.delete(flightLegs).where(eq(flightLegs.missionId, id));
      console.log(`Storage: Deleted ${legDeleteResult.rowCount || 0} flight legs`);
      
      const result = await db.delete(missions).where(eq(missions.id, id));
      console.log(`Storage: Mission delete result rowCount: ${result.rowCount}`);
      
      return (result.rowCount || 0) > 0;
    } catch (error) {
      console.error(`Storage: Error deleting mission ${id}:`, error);
      throw error;
    }
  }

  async extendMission(id: number, newEndDate: Date, reason: string): Promise<Mission | undefined> {
    const mission = await this.getMission(id);
    if (!mission) return undefined;

    const dateChangeHistory = mission.dateChangeHistory as any[] || [];
    dateChangeHistory.push({
      oldDate: mission.endDate,
      newDate: newEndDate,
      reason,
      changedBy: 'System',
      timestamp: new Date(),
      type: newEndDate > (mission.endDate || new Date()) ? 'extension' : 'reduction'
    });

    return await this.updateMission(id, {
      endDate: newEndDate,
      extensionReason: reason,
      dateChangeHistory: dateChangeHistory
    });
  }

  // Flight leg methods
  async getFlightLeg(id: number): Promise<FlightLeg | undefined> {
    const [leg] = await db.select().from(flightLegs).where(eq(flightLegs.id, id));
    return leg;
  }

  async getFlightLegsByMission(missionId: number): Promise<FlightLeg[]> {
    return await db.select().from(flightLegs).where(eq(flightLegs.missionId, missionId));
  }

  async createFlightLeg(insertLeg: InsertFlightLeg): Promise<FlightLeg> {
    const [leg] = await db.insert(flightLegs).values(insertLeg).returning();
    
    // Update airport visit tracking
    await this.updateAirportVisit('system', insertLeg.departureIcao, {
      hours: insertLeg.flightHours || 0,
      cargo: insertLeg.cargoWeight || 0,
      pax: insertLeg.pax || 0
    });
    
    await this.updateAirportVisit('system', insertLeg.arrivalIcao, {
      hours: insertLeg.flightHours || 0,
      cargo: insertLeg.cargoWeight || 0,
      pax: insertLeg.pax || 0
    });
    
    return leg;
  }

  async updateFlightLeg(id: number, updates: Partial<InsertFlightLeg>): Promise<FlightLeg | undefined> {
    const [leg] = await db
      .update(flightLegs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(flightLegs.id, id))
      .returning();
    return leg;
  }

  async deleteFlightLeg(id: number): Promise<boolean> {
    const result = await db.delete(flightLegs).where(eq(flightLegs.id, id));
    return (result.rowCount || 0) > 0;
  }

  // User profile methods
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfile).where(eq(userProfile.userId, userId));
    return profile;
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db.insert(userProfile).values(insertProfile).returning();
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const [profile] = await db
      .update(userProfile)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProfile.userId, userId))
      .returning();
    return profile;
  }

  async getFlightStatistics(userId: string): Promise<FlightStatistics> {
    const profile = await this.getUserProfile(userId);
    const userLegs = await db.select().from(flightLegs);
    
    if (!profile) {
      return {
        totalFlightHours: 0,
        totalDistanceNm: 0,
        totalCargoMoved: 0,
        totalPaxMoved: 0,
        missionsCompleted: 0,
        averageFlightHours: 0,
        longestFlight: 0,
        mostFrequentRoute: ""
      };
    }

    // Calculate route frequency
    const routeCounts = new Map<string, number>();
    userLegs.forEach(leg => {
      const route = `${leg.departureIcao}-${leg.arrivalIcao}`;
      routeCounts.set(route, (routeCounts.get(route) || 0) + 1);
    });

    let mostFrequentRoute = "";
    let maxCount = 0;
    for (const [route, count] of Array.from(routeCounts.entries())) {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentRoute = route;
      }
    }

    const totalFlightHours = userLegs.reduce((sum, leg) => sum + (leg.flightHours || 0), 0);
    const totalDistanceNm = userLegs.reduce((sum, leg) => sum + (leg.distanceNm || 0), 0);
    const totalCargoMoved = userLegs.reduce((sum, leg) => sum + (leg.cargoWeight || 0), 0);
    const totalPaxMoved = userLegs.reduce((sum, leg) => sum + (leg.pax || 0), 0);
    const longestFlight = Math.max(...userLegs.map(leg => leg.flightHours || 0), 0);

    return {
      totalFlightHours,
      totalDistanceNm,
      totalCargoMoved,
      totalPaxMoved,
      missionsCompleted: profile.missionsCompleted || 0,
      averageFlightHours: userLegs.length > 0 ? totalFlightHours / userLegs.length : 0,
      longestFlight,
      mostFrequentRoute
    };
  }

  async updateFlightStatistics(userId: string, leg: FlightLeg): Promise<void> {
    let profile = await this.getUserProfile(userId);
    if (!profile) {
      profile = await this.createUserProfile({
        userId,
        totalFlightHours: 0,
        totalDistanceNm: 0,
        totalCargoMoved: 0,
        totalPaxMoved: 0,
        missionsCompleted: 0,
        favoriteAirports: [],
      });
    }

    // Update statistics
    await this.updateUserProfile(userId, {
      totalFlightHours: (profile.totalFlightHours || 0) + (leg.flightHours || 0),
      totalDistanceNm: (profile.totalDistanceNm || 0) + (leg.distanceNm || 0),
      totalCargoMoved: (profile.totalCargoMoved || 0) + (leg.cargoWeight || 0),
      totalPaxMoved: (profile.totalPaxMoved || 0) + (leg.pax || 0),
    });
  }

  // AI Learning methods
  async getAILearningModel(userId: string): Promise<AILearningModel | undefined> {
    const [model] = await db.select().from(aiLearningModels).where(eq(aiLearningModels.userId, userId));
    return model;
  }

  async saveAILearningModel(model: InsertAILearningModel): Promise<AILearningModel> {
    const [savedModel] = await db.insert(aiLearningModels).values(model).returning();
    return savedModel;
  }

  async saveScanFeedback(feedback: InsertScanFeedback): Promise<ScanFeedback> {
    const [savedFeedback] = await db.insert(scanFeedback).values(feedback).returning();
    return savedFeedback;
  }

  // Airport visit tracking
  async getAirportVisits(userId: string): Promise<AirportVisit[]> {
    return await db.select().from(airportVisits).where(eq(airportVisits.userId, userId));
  }

  async updateAirportVisit(userId: string, icao: string, flightData: { hours: number; cargo: number; pax: number }): Promise<void> {
    const [existingVisit] = await db.select().from(airportVisits)
      .where(and(eq(airportVisits.userId, userId), eq(airportVisits.icao, icao)));

    if (existingVisit) {
      await db.update(airportVisits)
        .set({
          visitCount: (existingVisit.visitCount || 0) + 1,
          lastVisit: new Date(),
          totalFlightHours: (existingVisit.totalFlightHours || 0) + flightData.hours,
          totalCargo: (existingVisit.totalCargo || 0) + flightData.cargo,
          totalPax: (existingVisit.totalPax || 0) + flightData.pax,
          updatedAt: new Date(),
        })
        .where(eq(airportVisits.id, existingVisit.id));
    } else {
      await db.insert(airportVisits).values({
        userId,
        icao,
        visitCount: 1,
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalFlightHours: flightData.hours,
        totalCargo: flightData.cargo,
        totalPax: flightData.pax,
      });
    }
  }
}

export const storage = new DatabaseStorage();