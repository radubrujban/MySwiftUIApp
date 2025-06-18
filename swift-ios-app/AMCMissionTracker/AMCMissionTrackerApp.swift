import SwiftUI

@main
struct AMCMissionTrackerApp: App {
    @StateObject private var missionService = MissionService()
    @State private var hasAcceptedSecurityWarning = false
    
    var body: some Scene {
        WindowGroup {
            if hasAcceptedSecurityWarning {
                ContentView()
                    .environmentObject(missionService)
            } else {
                SecurityWarningView(onAccept: {
                    hasAcceptedSecurityWarning = true
                })
            }
        }
    }
}