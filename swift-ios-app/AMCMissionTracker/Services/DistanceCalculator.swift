import Foundation
import CoreLocation

class DistanceCalculator {
    
    static func calculateDistance(from: Airport, to: Airport) -> Double {
        let fromLocation = CLLocation(latitude: from.latitude, longitude: from.longitude)
        let toLocation = CLLocation(latitude: to.latitude, longitude: to.longitude)
        
        let distanceInMeters = fromLocation.distance(from: toLocation)
        let distanceInNauticalMiles = distanceInMeters * 0.000539957 // Convert meters to nautical miles
        
        return distanceInNauticalMiles
    }
    
    static func calculateDistance(fromIcao: String, toIcao: String, airports: [Airport]) -> Double {
        guard let fromAirport = airports.first(where: { $0.icao == fromIcao }),
              let toAirport = airports.first(where: { $0.icao == toIcao }) else {
            return 0.0
        }
        
        return calculateDistance(from: fromAirport, to: toAirport)
    }
    
    static func searchAirports(query: String, in airports: [Airport]) -> [Airport] {
        guard !query.isEmpty else { return [] }
        
        let filtered = airports.filter { airport in
            airport.icao.localizedCaseInsensitiveContains(query) ||
            airport.name.localizedCaseInsensitiveContains(query) ||
            airport.city.localizedCaseInsensitiveContains(query)
        }
        
        // Sort by relevance (ICAO code matches first, then name matches)
        return filtered.sorted { airport1, airport2 in
            let icaoMatch1 = airport1.icao.localizedCaseInsensitiveContains(query)
            let icaoMatch2 = airport2.icao.localizedCaseInsensitiveContains(query)
            
            if icaoMatch1 && !icaoMatch2 {
                return true
            } else if !icaoMatch1 && icaoMatch2 {
                return false
            } else {
                return airport1.icao < airport2.icao
            }
        }
    }
    
    static func fuzzySearchAirports(query: String, in airports: [Airport], maxResults: Int = 10) -> [Airport] {
        guard !query.isEmpty else { return [] }
        
        var scoredAirports: [(airport: Airport, score: Double)] = []
        
        for airport in airports {
            let score = calculateSimilarityScore(query: query, airport: airport)
            if score > 0.3 { // Minimum similarity threshold
                scoredAirports.append((airport: airport, score: score))
            }
        }
        
        // Sort by score (highest first) and return top results
        return scoredAirports
            .sorted { $0.score > $1.score }
            .prefix(maxResults)
            .map { $0.airport }
    }
    
    private static func calculateSimilarityScore(query: String, airport: Airport) -> Double {
        let queryLower = query.lowercased()
        
        // ICAO code exact match gets highest score
        if airport.icao.lowercased() == queryLower {
            return 1.0
        }
        
        // ICAO code starts with query gets high score
        if airport.icao.lowercased().hasPrefix(queryLower) {
            return 0.9
        }
        
        // ICAO code contains query gets good score
        if airport.icao.lowercased().contains(queryLower) {
            return 0.8
        }
        
        // Name starts with query gets good score
        if airport.name.lowercased().hasPrefix(queryLower) {
            return 0.7
        }
        
        // Name contains query gets decent score
        if airport.name.lowercased().contains(queryLower) {
            return 0.6
        }
        
        // City starts with query gets decent score
        if airport.city.lowercased().hasPrefix(queryLower) {
            return 0.5
        }
        
        // City contains query gets lower score
        if airport.city.lowercased().contains(queryLower) {
            return 0.4
        }
        
        return 0.0
    }
}