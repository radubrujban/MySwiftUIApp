import SwiftUI

struct ICAOAutocompleteView: View {
    @Binding var selectedIcao: String
    @State private var searchText = ""
    @State private var showingSuggestions = false
    @State private var searchResults: [Airport] = []
    
    let placeholder: String
    let airports = Airport.sampleAirports
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                TextField(placeholder, text: $searchText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .textInputAutocapitalization(.characters)
                    .onChange(of: searchText) { oldValue, newValue in
                        updateSearchResults(query: newValue)
                    }
                    .onTapGesture {
                        if !searchText.isEmpty {
                            showingSuggestions = true
                        }
                    }
                
                if !searchText.isEmpty {
                    Button("Clear") {
                        searchText = ""
                        selectedIcao = ""
                        showingSuggestions = false
                    }
                    .foregroundColor(.blue)
                }
            }
            
            if showingSuggestions && !searchResults.isEmpty {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 0) {
                        ForEach(searchResults.prefix(8), id: \.id) { airport in
                            Button(action: {
                                selectAirport(airport)
                            }) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        HStack {
                                            Text(airport.icao)
                                                .font(.headline)
                                                .fontWeight(.bold)
                                                .foregroundColor(.primary)
                                            
                                            Spacer()
                                        }
                                        
                                        Text(airport.name)
                                            .font(.subheadline)
                                            .foregroundColor(.secondary)
                                            .multilineTextAlignment(.leading)
                                        
                                        Text("\(airport.city), \(airport.country)")
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                    
                                    Spacer()
                                    
                                    Image(systemName: "location")
                                        .foregroundColor(.blue)
                                        .font(.caption)
                                }
                                .contentShape(Rectangle())
                            }
                            .buttonStyle(PlainButtonStyle())
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                            
                            if airport.id != searchResults.prefix(8).last?.id {
                                Divider()
                            }
                        }
                    }
                }
                .frame(maxHeight: 200)
                .background(Color(.systemBackground))
                .cornerRadius(8)
                .shadow(radius: 5)
                .transition(.opacity.combined(with: .scale))
            }
        }
        .onAppear {
            if !selectedIcao.isEmpty {
                searchText = selectedIcao
            }
        }
    }
    
    private func updateSearchResults(query: String) {
        if query.isEmpty {
            searchResults = []
            showingSuggestions = false
            return
        }
        
        searchResults = DistanceCalculator.fuzzySearchAirports(query: query, in: airports, maxResults: 8)
        showingSuggestions = !searchResults.isEmpty
    }
    
    private func selectAirport(_ airport: Airport) {
        searchText = airport.icao
        selectedIcao = airport.icao
        showingSuggestions = false
        
        // Hide keyboard
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}

#Preview {
    @State var selectedIcao = ""
    
    return VStack {
        ICAOAutocompleteView(
            selectedIcao: $selectedIcao,
            placeholder: "Enter ICAO code"
        )
        
        Text("Selected: \(selectedIcao)")
            .padding()
    }
    .padding()
}