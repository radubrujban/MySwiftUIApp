import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  SafeAreaView,
  StatusBar,
} from 'react-native';

interface SecurityWarningScreenProps {
  onAccept: () => void;
}

const SecurityWarningScreen: React.FC<SecurityWarningScreenProps> = ({ onAccept }) => {
  const [checkboxes, setCheckboxes] = useState({
    understanding: false,
    responsibility: false,
    unauthorized: false,
    monitoring: false,
    consent: false,
  });

  const allChecked = Object.values(checkboxes).every(Boolean);

  const handleCheckboxChange = (key: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDisagree = () => {
    Alert.alert(
      'Access Denied',
      'You must accept all terms to use this application. You will now be redirected to defense.gov.',
      [
        {
          text: 'OK',
          onPress: () => Linking.openURL('https://www.defense.gov'),
        },
      ]
    );
  };

  const CheckBox: React.FC<{ 
    checked: boolean; 
    onPress: () => void; 
    children: React.ReactNode; 
  }> = ({ checked, onPress, children }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkboxText}>{children}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1f2937" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>U.S. DEPARTMENT OF DEFENSE</Text>
        <Text style={styles.headerSubtitle}>COMPUTER NETWORK DEFENSE</Text>
        <Text style={styles.warningBadge}>⚠️ OFFICIAL USE ONLY ⚠️</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>
            🔒 GOVERNMENT SECURITY WARNING 🔒
          </Text>
          
          <Text style={styles.warningText}>
            You are accessing a U.S. Government information system. This system is provided for 
            authorized government use only. Unauthorized or improper use of this system may result 
            in administrative disciplinary action and civil and criminal penalties.
          </Text>

          <Text style={styles.warningText}>
            By continuing past this page, you expressly consent to monitoring of your actions on 
            this system. Evidence of your use, misuse, or actions on this system may be used for 
            administrative, criminal, or other adverse action. Continued use constitutes consent 
            to such monitoring.
          </Text>

          <Text style={styles.sectionTitle}>ACKNOWLEDGMENT REQUIRED:</Text>
          <Text style={styles.instructionText}>
            You must check all boxes below to verify your understanding and agreement:
          </Text>

          <View style={styles.checkboxSection}>
            <CheckBox
              checked={checkboxes.understanding}
              onPress={() => handleCheckboxChange('understanding')}
            >
              I understand this is a U.S. Government computer system for authorized personnel only.
            </CheckBox>

            <CheckBox
              checked={checkboxes.responsibility}
              onPress={() => handleCheckboxChange('responsibility')}
            >
              I acknowledge my responsibility to protect government information and systems.
            </CheckBox>

            <CheckBox
              checked={checkboxes.unauthorized}
              onPress={() => handleCheckboxChange('unauthorized')}
            >
              I understand that unauthorized access or misuse may result in criminal prosecution.
            </CheckBox>

            <CheckBox
              checked={checkboxes.monitoring}
              onPress={() => handleCheckboxChange('monitoring')}
            >
              I consent to monitoring and recording of my activities on this system.
            </CheckBox>

            <CheckBox
              checked={checkboxes.consent}
              onPress={() => handleCheckboxChange('consent')}
            >
              I agree to comply with all applicable laws, regulations, and Department of Defense policies.
            </CheckBox>
          </View>

          <Text style={styles.footerText}>
            This warning message provides users notice concerning applicable legal provisions 
            relating to computer systems and is displayed to ensure proper use of government systems.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.disagreeButton]} 
          onPress={handleDisagree}
        >
          <Text style={styles.disagreeButtonText}>I DO NOT AGREE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button, 
            styles.agreeButton,
            !allChecked && styles.disabledButton
          ]}
          onPress={allChecked ? onAccept : undefined}
          disabled={!allChecked}
        >
          <Text style={[
            styles.agreeButtonText,
            !allChecked && styles.disabledButtonText
          ]}>
            I AGREE - ENTER SYSTEM
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f2937',
  },
  header: {
    backgroundColor: '#991b1b',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#fbbf24',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#fde68a',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  warningBadge: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 12,
    borderRadius: 20,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  warningBox: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 24,
    borderWidth: 2,
    borderColor: '#dc2626',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  warningTitle: {
    color: '#dc2626',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  warningText: {
    color: '#f3f4f6',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'justify',
  },
  sectionTitle: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  instructionText: {
    color: '#e5e7eb',
    fontSize: 14,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  checkboxSection: {
    marginVertical: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6b7280',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxText: {
    color: '#f3f4f6',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  disagreeButton: {
    backgroundColor: '#dc2626',
    borderColor: '#991b1b',
  },
  disagreeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  agreeButton: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  agreeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#4b5563',
    borderColor: '#6b7280',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
});

export default SecurityWarningScreen;