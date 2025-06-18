import SwiftUI
import Charts

struct StatisticsView: View {
    @EnvironmentObject var missionService: MissionService
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 25) {
                    // Overview Cards
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 15) {
                        OverviewCard(
                            title: "Total Missions",
                            value: "\(missionService.missions.count)",
                            icon: "airplane",
                            color: .blue
                        )
                        
                        OverviewCard(
                            title: "Flight Hours",
                            value: String(format: "%.1f", missionService.getTotalFlightHours()),
                            icon: "clock",
                            color: .green
                        )
                        
                        OverviewCard(
                            title: "Distance (NM)",
                            value: String(format: "%.0f", missionService.getTotalDistance()),
                            icon: "location",
                            color: .orange
                        )
                        
                        OverviewCard(
                            title: "Completed",
                            value: "\(missionService.getCompletedMissionsCount())",
                            icon: "checkmark.circle",
                            color: .purple
                        )
                    }
                    
                    // Mission Status Distribution
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Mission Status Distribution")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        if !missionService.missions.isEmpty {
                            MissionStatusChart(missions: missionService.missions)
                                .frame(height: 200)
                                .padding()
                                .background(Color(.systemBackground))
                                .cornerRadius(12)
                                .shadow(radius: 2)
                        } else {
                            EmptyStateView(message: "No missions to display")
                        }
                    }
                    
                    // Monthly Flight Hours
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Monthly Flight Hours")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        if !missionService.missions.isEmpty {
                            MonthlyHoursChart(missions: missionService.missions)
                                .frame(height: 200)
                                .padding()
                                .background(Color(.systemBackground))
                                .cornerRadius(12)
                                .shadow(radius: 2)
                        } else {
                            EmptyStateView(message: "No flight data to display")
                        }
                    }
                    
                    // Aircraft Usage
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Aircraft Usage")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        if !missionService.missions.isEmpty {
                            AircraftUsageList(missions: missionService.missions)
                        } else {
                            EmptyStateView(message: "No aircraft data to display")
                        }
                    }
                    
                    // Key Metrics
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Key Metrics")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        VStack(spacing: 12) {
                            MetricRow(
                                title: "Average Flight Hours per Mission",
                                value: String(format: "%.1f hours", missionService.getAverageFlightHours())
                            )
                            
                            MetricRow(
                                title: "Longest Single Mission",
                                value: String(format: "%.1f hours", missionService.getLongestFlightHours())
                            )
                            
                            MetricRow(
                                title: "Total Passengers Moved",
                                value: "\(missionService.getTotalPaxMoved()) pax"
                            )
                            
                            MetricRow(
                                title: "Total Cargo Moved",
                                value: String(format: "%.0f lbs", missionService.getTotalCargoMoved())
                            )
                        }
                        .padding()
                        .background(Color(.systemBackground))
                        .cornerRadius(12)
                        .shadow(radius: 2)
                    }
                }
                .padding()
            }
            .navigationTitle("Statistics")
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

struct OverviewCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
            
            Text(value)
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(color)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

struct MissionStatusChart: View {
    let missions: [Mission]
    
    private var statusData: [(status: MissionStatus, count: Int)] {
        let grouped = Dictionary(grouping: missions, by: { $0.status })
        return MissionStatus.allCases.map { status in
            (status: status, count: grouped[status]?.count ?? 0)
        }.filter { $0.count > 0 }
    }
    
    var body: some View {
        if statusData.isEmpty {
            EmptyStateView(message: "No mission data")
        } else {
            Chart(statusData, id: \.status) { item in
                SectorMark(
                    angle: .value("Count", item.count),
                    innerRadius: .ratio(0.5),
                    angularInset: 2
                )
                .foregroundStyle(statusColor(for: item.status))
                .opacity(0.8)
            }
            .chartLegend(position: .bottom, alignment: .center)
        }
    }
    
    private func statusColor(for status: MissionStatus) -> Color {
        switch status {
        case .planning: return .yellow
        case .inProgress: return .blue
        case .completed: return .green
        case .deployment: return .red
        }
    }
}

struct MonthlyHoursChart: View {
    let missions: [Mission]
    
    private var monthlyData: [(month: String, hours: Double)] {
        let calendar = Calendar.current
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM"
        
        let grouped = Dictionary(grouping: missions, by: { mission in
            calendar.monthSymbols[calendar.component(.month, from: mission.startDate) - 1]
        })
        
        return grouped.map { month, missions in
            let totalHours = missions.reduce(0) { $0 + $1.totalFlightHours }
            return (month: month, hours: totalHours)
        }.sorted { $0.month < $1.month }
    }
    
    var body: some View {
        if monthlyData.isEmpty {
            EmptyStateView(message: "No flight hour data")
        } else {
            Chart(monthlyData, id: \.month) { item in
                BarMark(
                    x: .value("Month", item.month),
                    y: .value("Hours", item.hours)
                )
                .foregroundStyle(.blue.gradient)
            }
            .chartYAxis {
                AxisMarks(position: .leading)
            }
        }
    }
}

struct AircraftUsageList: View {
    let missions: [Mission]
    
    private var aircraftData: [(aircraft: String, count: Int, hours: Double)] {
        let grouped = Dictionary(grouping: missions, by: { $0.aircraftType })
        return grouped.map { aircraft, missions in
            let count = missions.count
            let hours = missions.reduce(0) { $0 + $1.totalFlightHours }
            return (aircraft: aircraft, count: count, hours: hours)
        }.sorted { $0.count > $1.count }
    }
    
    var body: some View {
        VStack(spacing: 8) {
            ForEach(aircraftData, id: \.aircraft) { item in
                HStack {
                    VStack(alignment: .leading) {
                        Text(item.aircraft)
                            .font(.headline)
                        Text("\(item.count) missions")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing) {
                        Text(String(format: "%.1f hrs", item.hours))
                            .font(.headline)
                            .foregroundColor(.blue)
                        Text("Total")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                .padding()
                .background(Color(.systemBackground))
                .cornerRadius(8)
                .shadow(radius: 1)
            }
        }
    }
}

struct MetricRow: View {
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Text(title)
                .font(.subheadline)
            
            Spacer()
            
            Text(value)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(.blue)
        }
    }
}

struct EmptyStateView: View {
    let message: String
    
    var body: some View {
        VStack(spacing: 10) {
            Image(systemName: "chart.bar")
                .font(.system(size: 40))
                .foregroundColor(.gray)
            
            Text(message)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, minHeight: 100)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

#Preview {
    StatisticsView()
        .environmentObject(MissionService())
}