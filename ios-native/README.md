# AMC Mission Tracker - Native iOS App

## Overview
Complete React Native iOS application for Air Mobility Command mission tracking, designed for App Store deployment. This native version maintains all functionality from the web application while optimizing for mobile use.

## Features
- **Government Security Warning**: DoD-compliant mandatory security verification
- **Mission Management**: Create, edit, and track AMC missions
- **Distance Calculation**: Automatic nautical mile calculations for 73+ airports
- **Flight Statistics**: Comprehensive tracking of flight hours, cargo, and personnel
- **Encrypted Storage**: AES-256-GCM encryption for sensitive data
- **Offline Operation**: Full functionality without internet connection

## Prerequisites
- macOS with Xcode 14.0 or later
- iOS 13.0+ target devices
- Apple Developer Account for App Store deployment
- CocoaPods installed (`sudo gem install cocoapods`)

## Installation & Setup

### 1. Install Dependencies
```bash
cd ios-native
npm install
npx pod-install ios
```

### 2. Open in Xcode
```bash
open ios/AMCMissionTracker.xcworkspace
```

### 3. Configure Bundle Identifier
1. Select your project in Xcode
2. Change Bundle Identifier to your unique identifier: `com.yourorg.amcmissiontracker`
3. Select your Development Team in Signing & Capabilities

### 4. Build & Run
- For Simulator: `npx react-native run-ios`
- For Device: Build and run through Xcode

## App Store Deployment

### 1. Archive Build
1. In Xcode, select "Any iOS Device" or your connected device
2. Product → Archive
3. Wait for build to complete

### 2. App Store Connect
1. Upload to App Store Connect via Xcode Organizer
2. Fill in App Information:
   - **App Name**: AMC Mission Tracker
   - **Category**: Productivity
   - **Description**: Official Air Mobility Command mission tracking application
   - **Keywords**: AMC, mission, flight, tracking, military, aviation

### 3. App Review Information
- **Demo Account**: Not required (app works without login)
- **Review Notes**: "Official U.S. Air Force application for mission tracking. Government security warning is mandatory for DoD compliance."
- **Privacy Policy**: Data stored locally only, no external transmission

### 4. Privacy & Compliance
- **Encryption**: Uses standard iOS encryption APIs
- **Data Collection**: None (all data stays on device)
- **Government Use**: Select "Yes" - this is for government/military use

## Security Compliance

### DoD Requirements Met
- Mandatory government security warning screen
- AES-256-GCM encryption for sensitive data
- Local data storage only (no cloud sync)
- Session timeout and security verification
- Audit logging for security events

### Permissions Required
- **Camera**: Document scanning and photo capture
- **Photo Library**: Save mission-related images
- **Location**: Calculate accurate flight distances

## App Structure

### Core Screens
- `SecurityWarningScreen`: DoD-compliant mandatory warning
- `HomeScreen`: Mission overview and navigation
- `MissionDetailsScreen`: Detailed mission information
- `NewMissionScreen`: Create new missions
- `StatisticsScreen`: Flight performance analytics
- `SettingsScreen`: App configuration and security

### Services
- `MissionService`: Local data management with encryption
- `DistanceCalculator`: Great circle distance calculations
- Airport database with 73+ military and civilian airports

### Security Features
- Encrypted AsyncStorage for sensitive data
- 30-day security warning acceptance
- Local-only data storage
- Government compliance indicators

## Testing Checklist

### Core Functionality
- [ ] Security warning displays and requires all 5 checkboxes
- [ ] Mission creation with all required fields
- [ ] Distance calculation works for airport pairs
- [ ] Statistics update correctly after mission changes
- [ ] Settings allow data export and clearing
- [ ] Photo capture and storage functions

### Security Testing
- [ ] Data encryption enabled by default
- [ ] Security warning reappears after 30 days
- [ ] No external network requests (except optional email)
- [ ] Sensitive data not visible in device backups

### Device Testing
- [ ] iPhone (various screen sizes)
- [ ] iPad compatibility
- [ ] Portrait and landscape orientations
- [ ] iOS 13+ compatibility
- [ ] Performance on older devices

## Deployment Notes

### Version Management
- Current Version: 1.0.0
- Build Number: Increment for each App Store submission
- Update Info.plist for version changes

### App Store Guidelines
- Follows Apple Human Interface Guidelines
- No in-app purchases or subscriptions
- Government/Enterprise use case clearly documented
- Privacy policy addresses data handling

### Support Information
- Support Email: Configure in SettingsScreen
- Privacy Policy: Built into app settings
- Government Compliance: DoD security requirements met

## Troubleshooting

### Common Build Issues
1. **Pod Installation**: Run `npx pod-install ios` if dependencies fail
2. **Xcode Cache**: Clean build folder (Cmd+Shift+K) and rebuild
3. **Signing Issues**: Verify Apple Developer Account and certificates
4. **Simulator Issues**: Reset simulator or try different device

### Runtime Issues
1. **Security Warning Loop**: Clear app data in Settings
2. **Distance Calculation**: Verify airport ICAO codes are correct
3. **Photo Issues**: Check camera permissions in device settings
4. **Storage Issues**: Verify encrypted storage is working

## Additional Resources
- React Native Documentation: https://reactnative.dev/
- Apple Developer Guidelines: https://developer.apple.com/app-store/review/guidelines/
- DoD Security Requirements: Consult your security officer

## License
Official U.S. Government application for Air Mobility Command operations.