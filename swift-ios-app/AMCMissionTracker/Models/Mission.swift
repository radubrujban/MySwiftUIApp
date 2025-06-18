import Foundation

struct Mission: Identifiable, Codable {
    let id = UUID()
    var missionNumber: String
    var missionType: String
    var status: MissionStatus
    var startDate: Date
    var endDate: Date
    var legs: [FlightLeg]
    var pax: Int
    var cargo: Double
    var aircraftType: String
    var notes: String
    var photos: [String]
    var crewInfo: CrewInfo?
    
    var totalFlightHours: Double {
        legs.reduce(0) { $0 + $1.flightHours }
    }
    
    var totalDistance: Double {
        legs.reduce(0) { $0 + $1.distanceNm }
    }
    
    var dateRange: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        return "\(formatter.string(from: startDate)) - \(formatter.string(from: endDate))"
    }
    
    init(missionNumber: String = "", 
         missionType: String = "Transport",
         status: MissionStatus = .planning,
         startDate: Date = Date(),
         endDate: Date = Calendar.current.date(byAdding: .day, value: 7, to: Date()) ?? Date(),
         legs: [FlightLeg] = [],
         pax: Int = 0,
         cargo: Double = 0.0,
         aircraftType: String = "C-17A",
         notes: String = "",
         photos: [String] = [],
         crewInfo: CrewInfo? = nil) {
        self.missionNumber = missionNumber
        self.missionType = missionType
        self.status = status
        self.startDate = startDate
        self.endDate = endDate
        self.legs = legs
        self.pax = pax
        self.cargo = cargo
        self.aircraftType = aircraftType
        self.notes = notes
        self.photos = photos
        self.crewInfo = crewInfo
    }
}

enum MissionStatus: String, CaseIterable, Codable {
    case planning = "Planning"
    case inProgress = "In Progress"
    case completed = "Completed"
    case deployment = "Deployment"
    
    var color: String {
        switch self {
        case .planning: return "yellow"
        case .inProgress: return "blue"
        case .completed: return "green"
        case .deployment: return "red"
        }
    }
}