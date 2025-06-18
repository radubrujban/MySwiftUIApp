import Foundation

struct Airport: Identifiable, Codable, Hashable {
    let id = UUID()
    var icao: String
    var name: String
    var city: String
    var country: String
    var latitude: Double
    var longitude: Double
    var similarity: Double?
    
    init(icao: String, name: String, city: String, country: String, latitude: Double, longitude: Double, similarity: Double? = nil) {
        self.icao = icao
        self.name = name
        self.city = city
        self.country = country
        self.latitude = latitude
        self.longitude = longitude
        self.similarity = similarity
    }
    
    var displayName: String {
        return "\(icao) - \(name)"
    }
    
    var fullDescription: String {
        return "\(icao) - \(name), \(city), \(country)"
    }
}

// Sample airport data for development/testing
extension Airport {
    static let sampleAirports: [Airport] = [
        Airport(icao: "KDOV", name: "Dover Air Force Base", city: "Dover", country: "United States", latitude: 39.1295, longitude: -75.4660),
        Airport(icao: "KTCM", name: "McChord Air Force Base", city: "Tacoma", country: "United States", latitude: 47.1377, longitude: -122.4764),
        Airport(icao: "KBGR", name: "Bangor International Airport", city: "Bangor", country: "United States", latitude: 44.8074, longitude: -68.8281),
        Airport(icao: "KWRI", name: "McGuire Air Force Base", city: "Wrightstown", country: "United States", latitude: 40.0156, longitude: -74.5918),
        Airport(icao: "EDDF", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", latitude: 50.0379, longitude: 8.5622),
        Airport(icao: "LTAG", name: "Incirlik Air Base", city: "Adana", country: "Turkey", latitude: 37.0021, longitude: 35.4259),
        Airport(icao: "OKAS", name: "Al Asad Air Base", city: "Al Anbar", country: "Iraq", latitude: 33.7856, longitude: 42.4411),
        Airport(icao: "OKBK", name: "Ali Al Salem Air Base", city: "Kuwait", country: "Kuwait", latitude: 29.3467, longitude: 47.5178),
        Airport(icao: "OTBH", name: "Al Udeid Air Base", city: "Doha", country: "Qatar", latitude: 25.1173, longitude: 51.3150),
        Airport(icao: "KFFO", name: "Wright-Patterson Air Force Base", city: "Dayton", country: "United States", latitude: 39.8261, longitude: -84.0483),
        Airport(icao: "RJTY", name: "Yokota Air Base", city: "Tokyo", country: "Japan", latitude: 35.7482, longitude: 139.3486),
        Airport(icao: "RKSO", name: "Osan Air Base", city: "Pyeongtaek", country: "South Korea", latitude: 37.0909, longitude: 127.0297),
        Airport(icao: "PHIK", name: "Hickam Air Force Base", city: "Honolulu", country: "United States", latitude: 21.3387, longitude: -157.9220),
        Airport(icao: "PANC", name: "Ted Stevens Anchorage International Airport", city: "Anchorage", country: "United States", latitude: 61.1744, longitude: -149.9961),
        Airport(icao: "EGLL", name: "London Heathrow Airport", city: "London", country: "United Kingdom", latitude: 51.4700, longitude: -0.4543)
    ]
}