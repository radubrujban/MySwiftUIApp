import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Switch,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MissionService } from '../services/MissionService';

const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all missions and statistics. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export functionality will be available in a future update. Your data is automatically backed up to your device.',
      [{ text: 'OK' }]
    );
  };

  const handleContactSupport = () => {
    const email = 'support@amcmissiontracker.mil';
    const subject = 'AMC Mission Tracker Support Request';
    const body = 'Please describe your issue or feedback:\n\n';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert(
        'Email Not Available',
        `Please contact support at: ${email}`,
        [{ text: 'OK' }]
      );
    });
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'All mission data is stored locally on your device and encrypted using AES-256-GCM encryption. No data is transmitted to external servers without your explicit consent. This application complies with DoD security requirements.',
      [{ text: 'OK' }]
    );
  };

  const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingsRow: React.FC<{
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showArrow?: boolean;
  }> = ({ title, subtitle, onPress, rightComponent, showArrow = false }) => (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingsRowContent}>
        <Text style={styles.settingsRowTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsRowSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent}
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your AMC Mission Tracker experience</Text>
        </View>

        <SettingsSection title="Preferences">
          <SettingsRow
            title="Push Notifications"
            subtitle="Receive notifications for mission updates"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingsRow
            title="Auto-Save"
            subtitle="Automatically save changes as you type"
            rightComponent={
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: '#767577', true: '#3b82f6' }}
                thumbColor={autoSave ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Security">
          <SettingsRow
            title="Data Encryption"
            subtitle="Encrypt sensitive mission data (AES-256-GCM)"
            rightComponent={
              <Switch
                value={encryptionEnabled}
                onValueChange={setEncryptionEnabled}
                trackColor={{ false: '#767577', true: '#10b981' }}
                thumbColor={encryptionEnabled ? '#ffffff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingsRow
            title="Security Warning"
            subtitle="Review DoD security requirements"
            onPress={() => Alert.alert('Security Warning', 'The government security warning is displayed each time you launch the app to ensure compliance with DoD regulations.')}
            showArrow
          />
        </SettingsSection>

        <SettingsSection title="Data Management">
          <SettingsRow
            title="Export Data"
            subtitle="Export missions and statistics"
            onPress={handleExportData}
            showArrow
          />
          
          <SettingsRow
            title="Clear All Data"
            subtitle="Permanently delete all missions and data"
            onPress={handleClearData}
            showArrow
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow
            title="Version"
            subtitle="1.0.0"
          />
          
          <SettingsRow
            title="Privacy Policy"
            subtitle="How your data is protected"
            onPress={handlePrivacyPolicy}
            showArrow
          />
          
          <SettingsRow
            title="Contact Support"
            subtitle="Get help or provide feedback"
            onPress={handleContactSupport}
            showArrow
          />
        </SettingsSection>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>AMC Mission Tracker</Text>
          <Text style={styles.footerText}>
            Official Air Mobility Command mission tracking application for flight operations, 
            crew management, and mission documentation. Designed for aircrew and support personnel.
          </Text>
          <Text style={styles.footerSubtext}>
            U.S. Air Force • Air Mobility Command • Official Use Only
          </Text>
        </View>

        <View style={styles.complianceSection}>
          <Text style={styles.complianceTitle}>🔒 Security Compliance</Text>
          <View style={styles.complianceList}>
            <Text style={styles.complianceItem}>• DoD-approved encryption standards</Text>
            <Text style={styles.complianceItem}>• Local data storage only</Text>
            <Text style={styles.complianceItem">• No external data transmission</Text>
            <Text style={styles.complianceItem}>• Government security warnings</Text>
            <Text style={styles.complianceItem}>• Regular security audits</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1f2937',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingsRowContent: {
    flex: 1,
  },
  settingsRowTitle: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  settingsRowSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: '#9ca3af',
    marginLeft: 8,
  },
  footer: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '600',
  },
  complianceSection: {
    backgroundColor: '#f3f4f6',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  complianceList: {
    gap: 6,
  },
  complianceItem: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
  },
});

export default SettingsScreen;