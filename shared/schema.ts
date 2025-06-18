import {
  pgTable,
  text,
  varchar,
  integer,
  timestamp,
  serial,
  real,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"),
  salt: varchar("salt"),
  twoFactorSecret: varchar("two_factor_secret"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  biometricEnabled: boolean("biometric_enabled").default(false),
  biometricPublicKey: varchar("biometric_public_key"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const missions = pgTable("missions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("Planning"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  estimatedStartDate: timestamp("estimated_start_date"),
  estimatedEndDate: timestamp("estimated_end_date"),
  isFlexibleDates: boolean("is_flexible_dates").default(false),
  extensionReason: text("extension_reason"),
  dateChangeHistory: jsonb("date_change_history"),
  description: text("description"),
  encryptedData: jsonb("encrypted_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const flightLegs = pgTable("flight_legs", {
  id: serial("id").primaryKey(),
  missionId: integer("mission_id").references(() => missions.id),
  departureIcao: varchar("departure_icao", { length: 4 }).notNull(),
  departureName: varchar("departure_name", { length: 256 }),
  arrivalIcao: varchar("arrival_icao", { length: 4 }).notNull(),
  arrivalName: varchar("arrival_name", { length: 256 }),
  departureTime: varchar("departure_time", { length: 10 }),
  arrivalTime: varchar("arrival_time", { length: 10 }),
  estimatedDepartureTime: timestamp("estimated_departure_time"),
  estimatedArrivalTime: timestamp("estimated_arrival_time"),
  actualDepartureTime: timestamp("actual_departure_time"),
  actualArrivalTime: timestamp("actual_arrival_time"),
  flightHours: real("flight_hours"),
  distanceNm: real("distance_nm"),
  aircraftType: varchar("aircraft_type", { length: 50 }),
  tailNumber: varchar("tail_number", { length: 20 }),
  pax: integer("pax").default(0),
  cargoWeight: real("cargo_weight").default(0),
  cargoType: varchar("cargo_type", { length: 100 }),
  specialHandling: text("special_handling"),
  encryptedData: jsonb("encrypted_data"),
  visitCount: integer("visit_count").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userProfile = pgTable("user_profile", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  totalFlightHours: real("total_flight_hours").default(0),
  totalDistanceNm: real("total_distance_nm").default(0),
  totalCargoMoved: real("total_cargo_moved").default(0),
  totalPaxMoved: integer("total_pax_moved").default(0),
  missionsCompleted: integer("missions_completed").default(0),
  favoriteAirports: varchar("favorite_airports").array(),
  encryptedData: jsonb("encrypted_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Learning models for handwriting recognition
export const aiLearningModels = pgTable("ai_learning_models", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  modelData: jsonb("model_data").notNull(),
  accuracy: real("accuracy").default(0.5),
  totalScans: integer("total_scans").default(0),
  version: varchar("version", { length: 20 }).default("1.0"),
  encryptedData: jsonb("encrypted_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scan feedback for AI learning
export const scanFeedback = pgTable("scan_feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  scanId: varchar("scan_id", { length: 256 }).notNull(),
  originalText: text("original_text"),
  correctedText: text("corrected_text"),
  characterMappings: jsonb("character_mappings"),
  encryptedData: jsonb("encrypted_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Airport visit tracking for globe features
// ICAO airports database with C-17 compatible runways (>3500ft)
export const airports = pgTable("airports", {
  id: serial("id").primaryKey(),
  icao: varchar("icao", { length: 4 }).notNull().unique(),
  iata: varchar("iata", { length: 3 }),
  name: varchar("name", { length: 256 }).notNull(),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  elevation: integer("elevation"), // feet
  longestRunway: integer("longest_runway").notNull(), // feet
  runwayCount: integer("runway_count").default(1),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const airportVisits = pgTable("airport_visits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  icao: varchar("icao", { length: 4 }).notNull(),
  visitCount: integer("visit_count").default(1),
  firstVisit: timestamp("first_visit").defaultNow(),
  lastVisit: timestamp("last_visit").defaultNow(),
  totalFlightHours: real("total_flight_hours").default(0),
  totalCargo: real("total_cargo").default(0),
  totalPax: integer("total_pax").default(0),
  encryptedData: jsonb("encrypted_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMissionSchema = createInsertSchema(missions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFlightLegSchema = createInsertSchema(flightLegs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfile).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAirportSchema = createInsertSchema(airports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missions.$inferSelect;
export type InsertFlightLeg = z.infer<typeof insertFlightLegSchema>;
export type FlightLeg = typeof flightLegs.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfile.$inferSelect;
export type Airport = typeof airports.$inferSelect;
export type InsertAirport = z.infer<typeof insertAirportSchema>;
export type AILearningModel = typeof aiLearningModels.$inferSelect;
export type InsertAILearningModel = typeof aiLearningModels.$inferInsert;
export type ScanFeedback = typeof scanFeedback.$inferSelect;
export type InsertScanFeedback = typeof scanFeedback.$inferInsert;
export type AirportVisit = typeof airportVisits.$inferSelect;
export type InsertAirportVisit = typeof airportVisits.$inferInsert;

export type MissionWithLegs = Mission & {
  legs: FlightLeg[];
};

export type FlightStatistics = {
  totalFlightHours: number;
  totalDistanceNm: number;
  totalCargoMoved: number;
  totalPaxMoved: number;
  missionsCompleted: number;
  averageFlightHours: number;
  longestFlight: number;
  mostFrequentRoute: string;
};