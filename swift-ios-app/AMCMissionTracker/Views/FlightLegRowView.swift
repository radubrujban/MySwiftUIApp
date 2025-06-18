import SwiftUI

struct FlightLegRowView: View {
    let leg: FlightLeg
    let legNumber: Int
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Leg \(legNumber)")
                    .font(.headline)
                    .fontWeight(.bold)
                
                Spacer()
                
                Text(leg.duration)
                    .font(.subheadline)
                    .foregroundColor(.blue)
                    .fontWeight(.semibold)
            }
            
            HStack {
                VStack(alignment: .leading) {
                    Text("FROM")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(leg.departureIcao.isEmpty ? "---" : leg.departureIcao)
                        .font(.title3)
                        .fontWeight(.bold)
                }
                
                Image(systemName: "arrow.right")
                    .foregroundColor(.blue)
                    .padding(.horizontal)
                
                VStack(alignment: .leading) {
                    Text("TO")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(leg.arrivalIcao.isEmpty ? "---" : leg.arrivalIcao)
                        .font(.title3)
                        .fontWeight(.bold)
                }
                
                Spacer()
            }
            
            HStack {
                Label(String(format: "%.0f NM", leg.distanceNm), systemImage: "location")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                if !leg.tailNumber.isEmpty {
                    Label(leg.tailNumber, systemImage: "airplane")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            if !leg.remarks.isEmpty {
                Text(leg.remarks)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.top, 2)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(10)
    }
}

#Preview {
    FlightLegRowView(
        leg: FlightLeg(
            legNumber: 1,
            departureIcao: "KDOV",
            arrivalIcao: "EDDF",
            flightHours: 8.5,
            distanceNm: 3650,
            tailNumber: "03-3124",
            remarks: "Strategic airlift to Frankfurt"
        ),
        legNumber: 1
    )
    .padding()
}