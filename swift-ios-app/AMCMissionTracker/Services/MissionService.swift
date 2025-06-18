import Foundation
import Combine

class MissionService: ObservableObject {
    @Published var missions: [Mission] = []
    @Published var isLoading = false
    
    private let userDefaults = UserDefaults.standard
    private let missionsKey = "SavedMissions"
    
    init() {
        loadMissions()
    }
    
    func loadMissions() {
        isLoading = true
        
        if let data = userDefaults.data(forKey: missionsKey),
           let decodedMissions = try? JSONDecoder().decode([Mission].self, from: data) {
            self.missions = decodedMissions
        } else {
            // Initialize with sample mission if no saved data
            self.missions = [sampleMission()]
        }
        
        isLoading = false
    }
    
    func saveMissions() {
        if let encoded = try? JSONEncoder().encode(missions) {
            userDefaults.set(encoded, forKey: missionsKey)
        }
    }
    
    func addMission(_ mission: Mission) {
        missions.append(mission)
        saveMissions()
    }
    
    func updateMission(_ mission: Mission) {
        if let index = missions.firstIndex(where: { $0.id == mission.id }) {
            missions[index] = mission
            saveMissions()
        }
    }
    
    func deleteMission(_ mission: Mission) {
        missions.removeAll { $0.id == mission.id }
        saveMissions()
    }
    
    func getMission(by id: UUID) -> Mission? {
        return missions.first { $0.id == id }
    }
    
    // Statistics calculations
    func getTotalFlightHours() -> Double {
        return missions.reduce(0) { $0 + $1.totalFlightHours }
    }
    
    func getTotalDistance() -> Double {
        return missions.reduce(0) { $0 + $1.totalDistance }
    }
    
    func getTotalCargoMoved() -> Double {
        return missions.reduce(0) { $0 + $1.cargo }
    }
    
    func getTotalPaxMoved() -> Int {
        return missions.reduce(0) { $0 + $1.pax }
    }
    
    func getCompletedMissionsCount() -> Int {
        return missions.filter { $0.status == .completed }.count
    }
    
    func getAverageFlightHours() -> Double {
        let total = getTotalFlightHours()
        let count = missions.count
        return count > 0 ? total / Double(count) : 0
    }
    
    func getLongestFlightHours() -> Double {
        return missions.map { $0.totalFlightHours }.max() ?? 0
    }
    
    private func sampleMission() -> Mission {
        var mission = Mission(
            missionNumber: "AMC001-25",
            missionType: "Airlift",
            status: .inProgress,
            startDate: Date(),
            endDate: Calendar.current.date(byAdding: .day, value: 5, to: Date()) ?? Date(),
            pax: 45,
            cargo: 12500,
            aircraftType: "C-17A Globemaster III",
            notes: "Strategic airlift mission supporting NATO operations"
        )
        
        mission.legs = [
            FlightLeg(
                legNumber: 1,
                departureIcao: "KDOV",
                arrivalIcao: "EDDF",
                departureTime: Date(),
                arrivalTime: Calendar.current.date(byAdding: .hour, value: 8, to: Date()) ?? Date(),
                flightHours: 8.5,
                distanceNm: 3650,
                tailNumber: "03-3124",
                remarks: "Initial leg to Frankfurt",
                pax: 45,
                cargo: 12500
            ),
            FlightLeg(
                legNumber: 2,
                departureIcao: "EDDF",
                arrivalIcao: "LTAG",
                departureTime: Calendar.current.date(byAdding: .day, value: 1, to: Date()) ?? Date(),
                arrivalTime: Calendar.current.date(byAdding: .day, value: 1, to: Calendar.current.date(byAdding: .hour, value: 4, to: Date()) ?? Date()) ?? Date(),
                flightHours: 4.2,
                distanceNm: 1850,
                tailNumber: "03-3124",
                remarks: "Continuation to Incirlik",
                pax: 45,
                cargo: 12500
            )
        ]
        
        return mission
    }
}