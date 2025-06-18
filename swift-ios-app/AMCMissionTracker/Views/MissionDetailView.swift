import SwiftUI

struct MissionDetailView: View {
    @EnvironmentObject var missionService: MissionService
    @Environment(\.dismiss) private var dismiss
    
    @State private var mission: Mission
    @State private var isEditing = false
    @State private var showingDeleteAlert = false
    
    init(mission: Mission) {
        _mission = State(initialValue: mission)
    }
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Mission Header
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            VStack(alignment: .leading) {
                                Text(mission.missionNumber)
                                    .font(.largeTitle)
                                    .fontWeight(.bold)
                                
                                Text(mission.missionType)
                                    .font(.title2)
                                    .foregroundColor(.secondary)
                            }
                            
                            Spacer()
                            
                            StatusBadge(status: mission.status)
                        }
                        
                        Text(mission.aircraftType)
                            .font(.headline)
                            .foregroundColor(.blue)
                        
                        Text(mission.dateRange)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)
                    
                    // Mission Statistics
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 2), spacing: 15) {
                        StatCard(title: "Total Hours", value: String(format: "%.1f", mission.totalFlightHours), color: .blue)
                        StatCard(title: "Distance (NM)", value: String(format: "%.0f", mission.totalDistance), color: .green)
                        StatCard(title: "Passengers", value: "\(mission.pax)", color: .orange)
                        StatCard(title: "Cargo (lbs)", value: String(format: "%.0f", mission.cargo), color: .purple)
                    }
                    
                    // Flight Legs
                    VStack(alignment: .leading, spacing: 15) {
                        Text("Flight Legs")
                            .font(.title2)
                            .fontWeight(.bold)
                        
                        if mission.legs.isEmpty {
                            HStack {
                                Image(systemName: "airplane")
                                    .foregroundColor(.gray)
                                Text("No flight legs recorded")
                                    .foregroundColor(.gray)
                                Spacer()
                            }
                            .padding()
                            .background(Color(.systemGray6))
                            .cornerRadius(10)
                        } else {
                            ForEach(mission.legs.sorted(by: { $0.legNumber < $1.legNumber })) { leg in
                                FlightLegDetailView(leg: leg)
                            }
                        }
                    }
                    
                    // Notes Section
                    if !mission.notes.isEmpty {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Notes")
                                .font(.title2)
                                .fontWeight(.bold)
                            
                            Text(mission.notes)
                                .font(.body)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(10)
                        }
                    }
                    
                    // Action Buttons
                    VStack(spacing: 10) {
                        Button("Edit Mission") {
                            isEditing = true
                        }
                        .buttonStyle(.borderedProminent)
                        .frame(maxWidth: .infinity)
                        
                        Button("Delete Mission") {
                            showingDeleteAlert = true
                        }
                        .buttonStyle(.bordered)
                        .foregroundColor(.red)
                        .frame(maxWidth: .infinity)
                    }
                    .padding(.top, 20)
                }
                .padding()
            }
            .navigationTitle("Mission Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
            .sheet(isPresented: $isEditing) {
                EditMissionView(mission: mission) { updatedMission in
                    mission = updatedMission
                    missionService.updateMission(updatedMission)
                }
            }
            .alert("Delete Mission", isPresented: $showingDeleteAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Delete", role: .destructive) {
                    missionService.deleteMission(mission)
                    dismiss()
                }
            } message: {
                Text("Are you sure you want to delete this mission? This action cannot be undone.")
            }
        }
    }
}

struct FlightLegDetailView: View {
    let leg: FlightLeg
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Leg \(leg.legNumber)")
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
        .background(Color(.systemBackground))
        .cornerRadius(10)
        .shadow(radius: 2)
    }
}

struct EditMissionView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var editableMission: Mission
    let onSave: (Mission) -> Void
    
    init(mission: Mission, onSave: @escaping (Mission) -> Void) {
        _editableMission = State(initialValue: mission)
        self.onSave = onSave
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section("Mission Information") {
                    TextField("Mission Number", text: $editableMission.missionNumber)
                    TextField("Mission Type", text: $editableMission.missionType)
                    Picker("Status", selection: $editableMission.status) {
                        ForEach(MissionStatus.allCases, id: \.self) { status in
                            Text(status.rawValue).tag(status)
                        }
                    }
                    TextField("Aircraft Type", text: $editableMission.aircraftType)
                }
                
                Section("Dates") {
                    DatePicker("Start Date", selection: $editableMission.startDate, displayedComponents: [.date, .hourAndMinute])
                    DatePicker("End Date", selection: $editableMission.endDate, displayedComponents: [.date, .hourAndMinute])
                }
                
                Section("Cargo & Personnel") {
                    HStack {
                        Text("Passengers")
                        Spacer()
                        TextField("0", value: $editableMission.pax, format: .number)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.trailing)
                    }
                    
                    HStack {
                        Text("Cargo (lbs)")
                        Spacer()
                        TextField("0", value: $editableMission.cargo, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                }
                
                Section("Notes") {
                    TextField("Mission notes...", text: $editableMission.notes, axis: .vertical)
                        .lineLimit(3...6)
                }
            }
            .navigationTitle("Edit Mission")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        onSave(editableMission)
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    let sampleMission = Mission(
        missionNumber: "AMC001-25",
        missionType: "Airlift",
        status: .inProgress,
        pax: 45,
        cargo: 12500,
        aircraftType: "C-17A Globemaster III",
        notes: "Strategic airlift mission supporting NATO operations"
    )
    
    return MissionDetailView(mission: sampleMission)
        .environmentObject(MissionService())
}