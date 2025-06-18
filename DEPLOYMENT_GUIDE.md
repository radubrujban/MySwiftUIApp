# AMC Mission Tracker - iOS Deployment Guide

## Complete iOS App Package

This package contains a complete React Native iOS application ready for Xcode development and App Store deployment.

## Package Contents

### 1. Web Application (`client/`, `server/`, `shared/`)
- Full-featured web application with all AMC Mission Tracker functionality
- PostgreSQL database integration
- OCR document scanning capabilities
- ICAO airport distance calculations
- DoD security compliance features

### 2. React Native iOS App (`ios-native/`)
- Complete iOS native application
- Professional app icons and splash screens
- Xcode project files ready for development
- Bundle identifier: `com.amc.missiontracker`

## Quick Start for iOS Development

### Prerequisites
1. **macOS** with latest version
2. **Xcode** 12.0 or later
3. **Node.js** 16.0 or later
4. **CocoaPods** (`sudo gem install cocoapods`)

### Setup Instructions

1. **Extract and Navigate**
   ```bash
   cd ios-native
   npm install
   ```

2. **Install iOS Dependencies**
   ```bash
   cd ios
   pod install
   ```

3. **Open in Xcode**
   ```bash
   open AMCMissionTracker.xcworkspace
   ```

4. **Configure Signing**
   - In Xcode, select the project root
   - Go to "Signing & Capabilities"
   - Select your development team
   - Ensure bundle identifier is unique

5. **Build and Run**
   - Select target device/simulator
   - Press Cmd+R to build and run

## App Store Deployment

### Icon Assets
Professional app icons are included in `/assets/`:
- `app-icon-1.svg` - Military aviation theme
- `app-icon-2.svg` - Global mission tracking theme

### Splash Screens
Multiple splash screen options in `/assets/`:
- `splash-screen-1.svg` - Animated mission theme
- `splash-screen-2.svg` - Technical dashboard style
- `splash-screen-3.svg` - Clean modern design

### Required Icon Sizes for App Store
Convert SVG icons to PNG at these dimensions:
- 1024x1024px (App Store)
- 180x180px (iPhone)
- 167x167px (iPad Pro)
- 152x152px (iPad)
- 120x120px (iPhone)

### App Store Submission Checklist
- [ ] Configure app icons in Images.xcassets
- [ ] Set up launch screens
- [ ] Configure privacy permissions in Info.plist
- [ ] Test on physical device
- [ ] Archive and upload to App Store Connect

## Key Features

### Security Compliance
- DoD government system warning with 5-point verification
- Mandatory security acknowledgment before app access
- Encrypted data storage and transmission

### Mission Management
- IMI 170 Flying Crew Chief Mission Report format
- Manual mission logging with auto-save
- Photo attachments for mission documentation
- Date/time pickers for precise scheduling

### Flight Operations
- ICAO airport autocomplete with real-time search
- Automatic distance calculations between airports
- Flight statistics and mission totalization
- Crew information management (FCC and maintenance personnel)

### Technical Specifications
- React Native for cross-platform compatibility
- TypeScript for type-safe development
- Professional military-grade UI/UX design
- Offline-capable data storage

## Bundle Configuration

**Bundle Identifier:** `com.amc.missiontracker`
**Display Name:** AMC Mission Tracker
**Version:** 1.0.0
**Minimum iOS:** 12.4

## Support

This application is designed for U.S. Air Force Air Mobility Command personnel. All features comply with DoD security requirements and mission-critical operational standards.

For development questions, ensure all Xcode project dependencies are properly installed via CocoaPods and that your development environment meets the minimum requirements listed above.

## File Structure
```
ios-native/
├── ios/                          # Native iOS project
│   ├── AMCMissionTracker.xcodeproj/
│   ├── AMCMissionTracker/
│   │   ├── AppDelegate.h
│   │   ├── AppDelegate.mm
│   │   ├── Info.plist
│   │   ├── main.m
│   │   ├── LaunchScreen.storyboard
│   │   └── Images.xcassets/
│   ├── AMCMissionTrackerTests/
│   └── Podfile
├── src/                          # React Native source
│   ├── components/
│   ├── screens/
│   ├── services/
│   └── types/
├── assets/                       # App icons and splash screens
├── App.tsx                       # Main app component
└── package.json                  # Dependencies
```