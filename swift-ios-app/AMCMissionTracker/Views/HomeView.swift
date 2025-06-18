import SwiftUI

struct HomeView: View {
    @EnvironmentObject var missionService: MissionService
    @State private var showingNewMission = false
    @State private var selectedMission: Mission?
    @State private var searchText = ""
    
    var filteredMissions: [Mission] {
        if searchText.isEmpty {
            return missionService.missions.sorted { $0.startDate > $1.startDate }
        } else {
            return missionService.missions.filter { mission in
                mission.missionNumber.localizedCaseInsensitiveContains(searchText) ||
                mission.missionType.localizedCaseInsensitiveContains(searchText) ||
                mission.aircraftType.localizedCaseInsensitiveContains(searchText)
            }.sorted { $0.startDate > $1.startDate }
        }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header Stats
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 15) {
                        StatCard(title: "Active Missions", value: "\(missionService.missions.filter { $0.status == .inProgress }.count)", color: .blue)
                        StatCard(title: "Total Hours", value: String(format: "%.1f", missionService.getTotalFlightHours()), color: .green)
                        StatCard(title: "Distance (NM)", value: String(format: "%.0f", missionService.getTotalDistance()), color: .orange)
                        StatCard(title: "Completed", value: "\(missionService.getCompletedMissionsCount())", color: .purple)
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical, 10)
                
                // Search Bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    
                    TextField("Search missions...", text: $searchText)
                        .textFieldStyle(PlainTextFieldStyle())
                }
                .padding(.horizontal)
                .padding(.vertical, 8)
                .background(Color(.systemGray6))
                .cornerRadius(10)
                .padding(.horizontal)
                .padding(.bottom, 10)
                
                // Missions List
                if missionService.isLoading {
                    Spacer()
                    ProgressView("Loading missions...")
                    Spacer()
                } else if filteredMissions.isEmpty {
                    Spacer()
                    VStack(spacing: 15) {
                        Image(systemName: "airplane.circle")
                            .font(.system(size: 60))
                            .foregroundColor(.gray)
                        
                        Text(searchText.isEmpty ? "No missions found" : "No missions match your search")
                            .font(.headline)
                            .foregroundColor(.gray)
                        
                        if searchText.isEmpty {
                            Button("Create First Mission") {
                                showingNewMission = true
                            }
                            .buttonStyle(.borderedProminent)
                        }
                    }
                    Spacer()
                } else {
                    List {
                        ForEach(filteredMissions) { mission in
                            MissionRowView(mission: mission)
                                .contentShape(Rectangle())
                                .onTapGesture {
                                    selectedMission = mission
                                }
                        }
                        .onDelete(perform: deleteMissions)
                    }
                    .listStyle(PlainListStyle())
                }
            }
            .navigationTitle("AMC Mission Tracker")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        showingNewMission = true
                    }) {
                        Image(systemName: "plus")
                            .font(.title2)
                    }
                }
            }
            .sheet(isPresented: $showingNewMission) {
                NewMissionView()
            }
            .sheet(item: $selectedMission) { mission in
                MissionDetailView(mission: mission)
            }
            .refreshable {
                missionService.loadMissions()
            }
        }
    }
    
    private func deleteMissions(offsets: IndexSet) {
        for index in offsets {
            let mission = filteredMissions[index]
            missionService.deleteMission(mission)
        }
    }
}

struct MissionRowView: View {
    let mission: Mission
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(mission.missionNumber)
                        .font(.headline)
                        .fontWeight(.bold)
                    
                    Text(mission.missionType)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    StatusBadge(status: mission.status)
                    
                    Text(mission.aircraftType)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            
            HStack {
                Label("\(mission.legs.count) legs", systemImage: "airplane")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Label(String(format: "%.1f hrs", mission.totalFlightHours), systemImage: "clock")
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Label("\(mission.pax) pax", systemImage: "person.3")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Text(mission.dateRange)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }
}

struct StatusBadge: View {
    let status: MissionStatus
    
    var body: some View {
        Text(status.rawValue)
            .font(.caption)
            .fontWeight(.semibold)
            .padding(.horizontal, 8)
            .padding(.vertical, 2)
            .background(statusColor.opacity(0.2))
            .foregroundColor(statusColor)
            .cornerRadius(8)
    }
    
    private var statusColor: Color {
        switch status {
        case .planning:
            return .yellow
        case .inProgress:
            return .blue
        case .completed:
            return .green
        case .deployment:
            return .red
        }
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(color)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(minWidth: 80)
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(Color(.systemBackground))
        .cornerRadius(10)
        .shadow(radius: 2)
    }
}

#Preview {
    HomeView()
        .environmentObject(MissionService())
}