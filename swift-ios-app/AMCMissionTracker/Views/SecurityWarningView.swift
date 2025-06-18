import SwiftUI

struct SecurityWarningView: View {
    let onAccept: () -> Void
    @State private var checkedItems: Set<Int> = []
    @State private var showAlert = false
    
    private let securityPoints = [
        "I understand this is a U.S. Government system for official use only",
        "I acknowledge that unauthorized access is prohibited and subject to prosecution",
        "I understand that all activities may be monitored and recorded",
        "I agree to comply with all applicable security policies and procedures",
        "I confirm my authorization to access this Air Mobility Command system"
    ]
    
    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.05, green: 0.09, blue: 0.16),
                    Color(red: 0.12, green: 0.23, blue: 0.45)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 30) {
                    // Header Section
                    VStack(spacing: 15) {
                        Image(systemName: "shield.fill")
                            .font(.system(size: 60))
                            .foregroundColor(.yellow)
                        
                        Text("U.S. GOVERNMENT SYSTEM")
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        Text("OFFICIAL USE ONLY")
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundColor(.yellow)
                        
                        Text("AIR MOBILITY COMMAND")
                            .font(.headline)
                            .foregroundColor(.gray)
                    }
                    .padding(.top, 40)
                    
                    // Warning Text
                    VStack(alignment: .leading, spacing: 15) {
                        Text("SECURITY WARNING")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(.red)
                        
                        Text("This system is restricted to authorized users for official business only. Unauthorized access or use is prohibited and subject to criminal and civil penalties.")
                            .font(.body)
                            .foregroundColor(.white)
                            .multilineTextAlignment(.leading)
                        
                        Text("By continuing, you acknowledge that:")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundColor(.yellow)
                            .padding(.top, 10)
                    }
                    .padding(.horizontal, 20)
                    
                    // Checkbox Section
                    VStack(alignment: .leading, spacing: 12) {
                        ForEach(Array(securityPoints.enumerated()), id: \.offset) { index, point in
                            HStack(alignment: .top, spacing: 12) {
                                Button(action: {
                                    if checkedItems.contains(index) {
                                        checkedItems.remove(index)
                                    } else {
                                        checkedItems.insert(index)
                                    }
                                }) {
                                    Image(systemName: checkedItems.contains(index) ? "checkmark.square.fill" : "square")
                                        .font(.title3)
                                        .foregroundColor(checkedItems.contains(index) ? .green : .gray)
                                }
                                
                                Text(point)
                                    .font(.footnote)
                                    .foregroundColor(.white)
                                    .multilineTextAlignment(.leading)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                            }
                            .padding(.horizontal, 20)
                        }
                    }
                    .padding(.vertical, 20)
                    
                    // Action Buttons
                    VStack(spacing: 15) {
                        Button(action: {
                            if checkedItems.count == securityPoints.count {
                                onAccept()
                            } else {
                                showAlert = true
                            }
                        }) {
                            Text("ACKNOWLEDGE AND CONTINUE")
                                .font(.headline)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 15)
                                .background(
                                    checkedItems.count == securityPoints.count 
                                    ? Color.green 
                                    : Color.gray.opacity(0.5)
                                )
                                .cornerRadius(10)
                        }
                        .disabled(checkedItems.count != securityPoints.count)
                        
                        Button(action: {
                            // Exit app - in a real app this would close the app
                            exit(0)
                        }) {
                            Text("DECLINE AND EXIT")
                                .font(.subheadline)
                                .foregroundColor(.red)
                                .underline()
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 40)
                }
            }
        }
        .alert("Incomplete Acknowledgment", isPresented: $showAlert) {
            Button("OK") { }
        } message: {
            Text("You must acknowledge all security requirements before proceeding.")
        }
    }
}

#Preview {
    SecurityWarningView(onAccept: {})
}