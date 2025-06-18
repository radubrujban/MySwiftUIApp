import Foundation

struct CrewInfo: Codable {
    var fccMembers: [FCCMember]
    var maintenancePersonnel: [MaintenancePersonnel]
    var aircraftCommander: AircraftCommander
    
    init() {
        self.fccMembers = []
        self.maintenancePersonnel = []
        self.aircraftCommander = AircraftCommander()
    }
}

struct FCCMember: Identifiable, Codable {
    let id = UUID()
    var name: String
    var rank: String
    var employeeNumber: String
    var sdap: Bool
    var megp: Bool
    var departureDate: Date
    var returnDate: Date
    var distinguishedVisitors: String
    
    init(name: String = "", rank: String = "", employeeNumber: String = "", sdap: Bool = false, megp: Bool = false, departureDate: Date = Date(), returnDate: Date = Date(), distinguishedVisitors: String = "") {
        self.name = name
        self.rank = rank
        self.employeeNumber = employeeNumber
        self.sdap = sdap
        self.megp = megp
        self.departureDate = departureDate
        self.returnDate = returnDate
        self.distinguishedVisitors = distinguishedVisitors
    }
}

struct MaintenancePersonnel: Identifiable, Codable {
    let id = UUID()
    var name: String
    var rank: String
    var employeeNumber: String
    var sdap: Bool
    var megp: Bool
    var departureDate: Date
    var returnDate: Date
    var fccMonitor: String
    
    init(name: String = "", rank: String = "", employeeNumber: String = "", sdap: Bool = false, megp: Bool = false, departureDate: Date = Date(), returnDate: Date = Date(), fccMonitor: String = "") {
        self.name = name
        self.rank = rank
        self.employeeNumber = employeeNumber
        self.sdap = sdap
        self.megp = megp
        self.departureDate = departureDate
        self.returnDate = returnDate
        self.fccMonitor = fccMonitor
    }
}

struct AircraftCommander: Codable {
    var name: String
    var rank: String
    var flyingSquadron: String
    
    init(name: String = "", rank: String = "", flyingSquadron: String = "") {
        self.name = name
        self.rank = rank
        self.flyingSquadron = flyingSquadron
    }
}