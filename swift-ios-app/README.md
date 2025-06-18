# AMC Mission Tracker - Native Swift iOS App

## Complete Native iOS Application

This is a complete native Swift iOS application built with SwiftUI for Air Mobility Command mission tracking.

## Features

### Security & Compliance
- Mandatory DoD security warning with 5-point verification system
- Government system access controls
- Official Use Only data classification
- Secure local data storage with UserDefaults

### Mission Management
- Complete mission lifecycle tracking (Planning → In Progress → Completed → Deployment)
- IMI 170 Flying Crew Chief Mission Report format compliance
- Manual mission creation and editing
- Real-time auto-save functionality
- Mission statistics and analytics

### Flight Operations
- ICAO airport code autocomplete with fuzzy search
- Automatic distance calculations between airports using CoreLocation
- Flight leg management with detailed tracking
- Crew information management (FCC members, maintenance personnel, aircraft commander)
- Aircraft type and tail number tracking

### Data & Analytics
- Mission statistics dashboard with Charts framework
- Flight hours, distance, cargo, and passenger tracking
- Aircraft usage analytics
- Monthly flight hour trends
- Mission status distribution charts

### Professional UI/UX
- Native SwiftUI interface optimized for iOS
- Dark mode support
- Professional military-grade design
- Tab-based navigation
- Modal presentations for detailed views

## Technical Specifications

- **Language:** Swift 5.0
- **Framework:** SwiftUI
- **Deployment Target:** iOS 15.0+
- **Architecture:** MVVM with ObservableObject
- **Data Persistence:** UserDefaults with JSON encoding
- **Bundle ID:** com.amc.missiontracker

## Project Structure

```
AMCMissionTracker/
├── AMCMissionTrackerApp.swift    # App entry point with security gate
├── ContentView.swift             # Main tab navigation
├── Views/                        # All SwiftUI views
│   ├── SecurityWarningView.swift # DoD security warning
│   ├── HomeView.swift            # Mission list and overview
│   ├── MissionDetailView.swift   # Mission details and editing
│   ├── NewMissionView.swift      # Mission creation
│   ├── StatisticsView.swift      # Analytics dashboard
│   ├── SettingsView.swift        # App settings and data management
│   ├── ICAOAutocompleteView.swift # Airport search component
│   └── FlightLegRowView.swift    # Flight leg display component
├── Models/                       # Data models
│   ├── Mission.swift             # Mission data structure
│   ├── FlightLeg.swift          # Flight leg data structure
│   ├── Airport.swift            # Airport data with sample database
│   └── CrewInfo.swift           # Crew information structures
├── Services/                     # Business logic
│   ├── MissionService.swift     # Mission data management
│   └── DistanceCalculator.swift # Distance calculations and search
├── Assets.xcassets/             # App icons and colors
└── Info.plist                  # App configuration
```

## Development Setup

### Prerequisites
- **Xcode 15.0** or later
- **macOS Sonoma** or later
- **iOS Simulator** or physical iOS device

### Quick Start

1. **Open Project**
   ```bash
   open AMCMissionTracker.xcodeproj
   ```

2. **Configure Signing**
   - Select the project in Xcode
   - Go to "Signing & Capabilities"
   - Select your development team
   - Ensure bundle identifier is unique for your account

3. **Build and Run**
   - Select target device (iPhone/iPad simulator or connected device)
   - Press Cmd+R to build and run

### App Store Deployment

1. **Archive Build**
   - Select "Any iOS Device" as target
   - Product → Archive
   - Wait for build to complete

2. **Upload to App Store Connect**
   - In Organizer, select your archive
   - Click "Distribute App"
   - Choose "App Store Connect"
   - Follow upload wizard

3. **Required Assets**
   - App icons: Convert included SVG assets to required PNG sizes
   - Screenshots: Capture from simulator for App Store listing
   - Privacy policy: Required for camera/location permissions

## Key Features Implementation

### Security Warning System
The app implements a mandatory 5-point security verification system that users must acknowledge before accessing the application. This ensures compliance with DoD security requirements.

### Mission Data Model
Comprehensive mission tracking with:
- Mission metadata (number, type, status, dates)
- Flight leg details with ICAO codes
- Crew information management
- Cargo and passenger tracking
- Aircraft assignment

### Distance Calculation
Uses CoreLocation framework for precise distance calculations between airports based on latitude/longitude coordinates. Includes fuzzy search for ICAO codes with similarity scoring.

### Data Persistence
All mission data is stored locally using UserDefaults with JSON encoding. This ensures data persistence across app launches while maintaining security by keeping data on the device.

### Analytics Dashboard
Built with Swift Charts framework providing:
- Mission status distribution pie charts
- Monthly flight hours bar charts
- Aircraft usage statistics
- Key performance metrics

## Bundle Configuration

- **Display Name:** AMC Mission Tracker
- **Bundle Identifier:** com.amc.missiontracker
- **Version:** 1.0.0
- **Minimum iOS Version:** 15.0
- **Supported Devices:** iPhone, iPad
- **Orientations:** Portrait, Landscape Left, Landscape Right

## Privacy Permissions

The app requests the following permissions:
- **Camera:** For scanning mission documents and capturing photos
- **Photo Library:** For attaching mission photos and documentation
- **Location (When In Use):** For calculating flight distances and tracking routes

## Security Features

- Government system access warning
- Official Use Only data classification
- Local data encryption through iOS secure storage
- No external data transmission
- Secure authentication flow

## Sample Data

The app includes realistic sample airport data covering major AMC bases and international airports commonly used in airlift operations:
- Dover AFB (KDOV)
- McChord AFB (KTCM)
- Ramstein AB (ETAR)
- Incirlik AB (LTAG)
- Al Udeid AB (OTBH)
- And many more...

This native Swift iOS application provides a complete, professional solution for Air Mobility Command mission tracking with full App Store deployment readiness.