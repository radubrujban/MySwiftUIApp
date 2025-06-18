import SwiftUI

struct NewMissionView: View {
    @EnvironmentObject var missionService: MissionService
    @Environment(\.dismiss) private var dismiss
    
    @State private var mission = Mission()
    @State private var showingAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        NavigationView {
            Form {
                Section("Mission Information") {
                    TextField("Mission Number", text: $mission.missionNumber)
                        .textInputAutocapitalization(.characters)
                    
                    TextField("Mission Type", text: $mission.missionType)
                    
                    Picker("Status", selection: $mission.status) {
                        ForEach(MissionStatus.allCases, id: \.self) { status in
                            Text(status.rawValue).tag(status)
                        }
                    }
                    
                    TextField("Aircraft Type", text: $mission.aircraftType)
                }
                
                Section("Dates") {
                    DatePicker("Start Date", selection: $mission.startDate, displayedComponents: [.date, .hourAndMinute])
                    
                    DatePicker("End Date", selection: $mission.endDate, displayedComponents: [.date, .hourAndMinute])
                }
                
                Section("Cargo & Personnel") {
                    HStack {
                        Text("Passengers")
                        Spacer()
                        TextField("0", value: $mission.pax, format: .number)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.trailing)
                    }
                    
                    HStack {
                        Text("Cargo (lbs)")
                        Spacer()
                        TextField("0", value: $mission.cargo, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                }
                
                Section("Flight Legs") {
                    if mission.legs.isEmpty {
                        HStack {
                            Image(systemName: "airplane")
                                .foregroundColor(.gray)
                            Text("No flight legs added")
                                .foregroundColor(.gray)
                            Spacer()
                            Button("Add First Leg") {
                                addFlightLeg()
                            }
                            .buttonStyle(.borderedProminent)
                            .controlSize(.small)
                        }
                    } else {
                        ForEach(Array(mission.legs.enumerated()), id: \.element.id) { index, leg in
                            FlightLegRowView(leg: leg, legNumber: index + 1)
                        }
                        .onDelete(perform: deleteFlightLegs)
                        
                        Button("Add Flight Leg") {
                            addFlightLeg()
                        }
                    }
                }
                
                Section("Notes") {
                    TextField("Mission notes...", text: $mission.notes, axis: .vertical)
                        .lineLimit(3...6)
                }
            }
            .navigationTitle("New Mission")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Save") {
                        saveMission()
                    }
                    .disabled(mission.missionNumber.isEmpty)
                }
            }
            .alert("Error", isPresented: $showingAlert) {
                Button("OK") { }
            } message: {
                Text(alertMessage)
            }
        }
    }
    
    private func addFlightLeg() {
        let newLeg = FlightLeg(legNumber: mission.legs.count + 1)
        mission.legs.append(newLeg)
    }
    
    private func deleteFlightLegs(offsets: IndexSet) {
        mission.legs.remove(atOffsets: offsets)
        
        // Renumber remaining legs
        for (index, _) in mission.legs.enumerated() {
            mission.legs[index].legNumber = index + 1
        }
    }
    
    private func saveMission() {
        guard !mission.missionNumber.isEmpty else {
            alertMessage = "Mission number is required"
            showingAlert = true
            return
        }
        
        guard mission.endDate >= mission.startDate else {
            alertMessage = "End date must be after start date"
            showingAlert = true
            return
        }
        
        missionService.addMission(mission)
        dismiss()
    }
}

#Preview {
    NewMissionView()
        .environmentObject(MissionService())
}