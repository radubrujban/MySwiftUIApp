import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var missionService: MissionService
    @State private var showingAbout = false
    @State private var showingDataManagement = false
    @State private var showingExportAlert = false
    @State private var showingImportAlert = false
    @State private var exportMessage = ""
    
    var body: some View {
        NavigationView {
            List {
                Section("Application") {
                    HStack {
                        Label("Version", systemImage: "info.circle")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }
                    
                    Button(action: {
                        showingAbout = true
                    }) {
                        Label("About AMC Mission Tracker", systemImage: "questionmark.circle")
                    }
                }
                
                Section("Data Management") {
                    HStack {
                        Label("Total Missions", systemImage: "airplane")
                        Spacer()
                        Text("\(missionService.missions.count)")
                            .foregroundColor(.secondary)
                    }
                    
                    Button(action: {
                        showingDataManagement = true
                    }) {
                        Label("Manage Data", systemImage: "externaldrive")
                    }
                    
                    Button(action: {
                        exportData()
                    }) {
                        Label("Export Data", systemImage: "square.and.arrow.up")
                    }
                    
                    Button(action: {
                        showingImportAlert = true
                    }) {
                        Label("Import Data", systemImage: "square.and.arrow.down")
                    }
                }
                
                Section("Support") {
                    Button(action: {
                        sendFeedback()
                    }) {
                        Label("Send Feedback", systemImage: "envelope")
                    }
                    
                    Button(action: {
                        openDocumentation()
                    }) {
                        Label("Documentation", systemImage: "book")
                    }
                }
                
                Section("Security") {
                    HStack {
                        Label("Security Classification", systemImage: "shield")
                        Spacer()
                        Text("Official Use Only")
                            .foregroundColor(.orange)
                            .fontWeight(.semibold)
                    }
                    
                    HStack {
                        Label("Data Encryption", systemImage: "lock")
                        Spacer()
                        Text("Enabled")
                            .foregroundColor(.green)
                            .fontWeight(.semibold)
                    }
                }
                
                Section("Organization") {
                    HStack {
                        Label("Command", systemImage: "building.2")
                        Spacer()
                        Text("Air Mobility Command")
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Label("System Type", systemImage: "desktopcomputer")
                        Spacer()
                        Text("Mission Planning")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showingAbout) {
                AboutView()
            }
            .sheet(isPresented: $showingDataManagement) {
                DataManagementView()
            }
            .alert("Export Complete", isPresented: $showingExportAlert) {
                Button("OK") { }
            } message: {
                Text(exportMessage)
            }
            .alert("Import Data", isPresented: $showingImportAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Import Sample Data") {
                    importSampleData()
                }
            } message: {
                Text("Would you like to import sample mission data? This will not overwrite existing missions.")
            }
        }
    }
    
    private func exportData() {
        // In a real app, this would export to Files app or share sheet
        let missionCount = missionService.missions.count
        exportMessage = "Successfully exported \(missionCount) missions to mission_data.json"
        showingExportAlert = true
    }
    
    private func importSampleData() {
        // Add sample missions for demonstration
        let sampleMissions = createSampleMissions()
        for mission in sampleMissions {
            missionService.addMission(mission)
        }
    }
    
    private func sendFeedback() {
        // In a real app, this would open Mail app or feedback form
    }
    
    private func openDocumentation() {
        // In a real app, this would open documentation URL
    }
    
    private func createSampleMissions() -> [Mission] {
        var missions: [Mission] = []
        
        // Sample Mission 1
        var mission1 = Mission(
            missionNumber: "AMC002-25",
            missionType: "Humanitarian Aid",
            status: .completed,
            startDate: Calendar.current.date(byAdding: .day, value: -10, to: Date()) ?? Date(),
            endDate: Calendar.current.date(byAdding: .day, value: -5, to: Date()) ?? Date(),
            pax: 15,
            cargo: 8500,
            aircraftType: "C-130J Super Hercules",
            notes: "Disaster relief supplies to affected region"
        )
        
        mission1.legs = [
            FlightLeg(
                legNumber: 1,
                departureIcao: "KTCM",
                arrivalIcao: "PANC",
                flightHours: 3.5,
                distanceNm: 1200,
                tailNumber: "08-8602",
                pax: 15,
                cargo: 8500
            )
        ]
        
        missions.append(mission1)
        
        // Sample Mission 2
        var mission2 = Mission(
            missionNumber: "AMC003-25",
            missionType: "Training",
            status: .planning,
            startDate: Calendar.current.date(byAdding: .day, value: 5, to: Date()) ?? Date(),
            endDate: Calendar.current.date(byAdding: .day, value: 8, to: Date()) ?? Date(),
            pax: 25,
            cargo: 5000,
            aircraftType: "KC-46A Pegasus",
            notes: "Aerial refueling training exercise"
        )
        
        missions.append(mission2)
        
        return missions
    }
}

struct AboutView: View {
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    VStack(spacing: 15) {
                        Image(systemName: "airplane.circle.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.blue)
                        
                        Text("AMC Mission Tracker")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                        
                        Text("Version 1.0.0")
                            .font(.headline)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.top, 20)
                    
                    VStack(alignment: .leading, spacing: 15) {
                        Text("About")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        Text("The AMC Mission Tracker is an official U.S. Air Force application designed for Air Mobility Command personnel to efficiently track and manage airlift missions, cargo operations, and flight planning activities.")
                            .font(.body)
                        
                        Text("This application provides comprehensive mission management capabilities including flight leg tracking, distance calculations, crew information management, and mission statistics.")
                            .font(.body)
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                    
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Security Notice")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(.red)
                        
                        Text("This system is for official U.S. Government use only. Unauthorized access is prohibited and subject to prosecution under applicable laws.")
                            .font(.body)
                            .foregroundColor(.red)
                        
                        Text("All data within this application is classified as Official Use Only and must be handled according to applicable security protocols.")
                            .font(.body)
                            .foregroundColor(.red)
                    }
                    .padding()
                    .background(Color.red.opacity(0.1))
                    .cornerRadius(12)
                    
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Contact Information")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        Text("For technical support or questions regarding this application, contact your local Air Mobility Command IT support personnel.")
                            .font(.body)
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                }
                .padding()
            }
            .navigationTitle("About")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct DataManagementView: View {
    @EnvironmentObject var missionService: MissionService
    @Environment(\.dismiss) private var dismiss
    @State private var showingClearAlert = false
    
    var body: some View {
        NavigationView {
            List {
                Section("Storage Information") {
                    HStack {
                        Label("Total Missions", systemImage: "airplane")
                        Spacer()
                        Text("\(missionService.missions.count)")
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Label("Total Flight Hours", systemImage: "clock")
                        Spacer()
                        Text(String(format: "%.1f", missionService.getTotalFlightHours()))
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Label("Storage Used", systemImage: "internaldrive")
                        Spacer()
                        Text("Local Device")
                            .foregroundColor(.secondary)
                    }
                }
                
                Section("Data Actions") {
                    Button(action: {
                        missionService.saveMissions()
                    }) {
                        Label("Save Data", systemImage: "square.and.arrow.down")
                    }
                    
                    Button(action: {
                        missionService.loadMissions()
                    }) {
                        Label("Reload Data", systemImage: "arrow.clockwise")
                    }
                }
                
                Section("Danger Zone") {
                    Button(action: {
                        showingClearAlert = true
                    }) {
                        Label("Clear All Data", systemImage: "trash")
                            .foregroundColor(.red)
                    }
                }
            }
            .navigationTitle("Data Management")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .alert("Clear All Data", isPresented: $showingClearAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Clear All", role: .destructive) {
                    missionService.missions.removeAll()
                    missionService.saveMissions()
                    dismiss()
                }
            } message: {
                Text("Are you sure you want to delete all mission data? This action cannot be undone.")
            }
        }
    }
}

#Preview {
    SettingsView()
        .environmentObject(MissionService())
}