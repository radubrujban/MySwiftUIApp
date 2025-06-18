import Foundation

struct FlightLeg: Identifiable, Codable {
    let id = UUID()
    var legNumber: Int
    var departureIcao: String
    var arrivalIcao: String
    var departureTime: Date
    var arrivalTime: Date
    var flightHours: Double
    var distanceNm: Double
    var tailNumber: String
    var remarks: String
    var pax: Int
    var cargo: Double
    
    var duration: String {
        let hours = Int(flightHours)
        let minutes = Int((flightHours - Double(hours)) * 60)
        return String(format: "%02d:%02d", hours, minutes)
    }
    
    init(legNumber: Int = 1,
         departureIcao: String = "",
         arrivalIcao: String = "",
         departureTime: Date = Date(),
         arrivalTime: Date = Calendar.current.date(byAdding: .hour, value: 2, to: Date()) ?? Date(),
         flightHours: Double = 2.0,
         distanceNm: Double = 0.0,
         tailNumber: String = "",
         remarks: String = "",
         pax: Int = 0,
         cargo: Double = 0.0) {
        self.legNumber = legNumber
        self.departureIcao = departureIcao
        self.arrivalIcao = arrivalIcao
        self.departureTime = departureTime
        self.arrivalTime = arrivalTime
        self.flightHours = flightHours
        self.distanceNm = distanceNm
        self.tailNumber = tailNumber
        self.remarks = remarks
        self.pax = pax
        self.cargo = cargo
    }
}