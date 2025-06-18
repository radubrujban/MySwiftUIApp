import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { MissionService } from '../services/MissionService';
import { Mission } from '../types/Mission';
import DatePicker from 'react-native-date-picker';

type NewMissionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewMission'>;

const NewMissionScreen: React.FC = () => {
  const navigation = useNavigation<NewMissionScreenNavigationProp>();
  
  const [formData, setFormData] = useState({
    missionNumber: '',
    missionType: 'Channel Mission',
    status: 'Planning' as const,
    pax: '0',
    cargo: '0',
    aircraftType: '',
    notes: '',
  });
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const missionTypes = [
    'Channel Mission',
    'Exercise Mission',
    'Operational Mission',
    'Training Mission',
    'Humanitarian Mission',
    'Medical Evacuation',
    'Cargo Transport',
    'Personnel Transport',
    'Special Operations',
    'Diplomatic Mission'
  ];

  const statusOptions = ['Planning', 'In Progress', 'Completed', 'Deployment'] as const;

  const handleSave = async () => {
    if (!formData.missionNumber.trim()) {
      Alert.alert('Validation Error', 'Mission number is required');
      return;
    }

    setSaving(true);
    try {
      const dateRange = `${MissionService.formatDate(startDate)} - ${MissionService.formatDate(endDate)}`;
      
      const newMission: Mission = {
        id: MissionService.generateId(),
        missionNumber: formData.missionNumber.trim(),
        missionType: formData.missionType,
        status: formData.status,
        dateRange,
        legs: 0,
        pax: parseInt(formData.pax) || 0,
        cargo: parseInt(formData.cargo) || 0,
        aircraftType: formData.aircraftType.trim() || undefined,
        createdAt: new Date().toISOString(),
        notes: formData.notes.trim() || undefined,
        flightLegs: [],
        totalFlightHours: 0,
      };

      await MissionService.saveMission(newMission);
      await MissionService.updateStatistics(newMission);
      
      Alert.alert(
        'Success',
        'Mission created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating mission:', error);
      Alert.alert('Error', 'Failed to create mission');
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const PickerButton: React.FC<{
    title: string;
    value: string;
    onPress: () => void;
  }> = ({ title, value, onPress }) => (
    <TouchableOpacity style={styles.pickerButton} onPress={onPress}>
      <Text style={styles.pickerButtonLabel}>{title}</Text>
      <Text style={styles.pickerButtonValue}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Mission Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Mission Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.missionNumber}
              onChangeText={(value) => updateFormData('missionNumber', value)}
              placeholder="e.g., AMC-2024-001"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mission Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScrollView}>
              {missionTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.missionType === type && styles.selectedTypeButton
                  ]}
                  onPress={() => updateFormData('missionType', type)}
                >
                  <Text style={[
                    styles.typeButtonText,
                    formData.missionType === type && styles.selectedTypeButtonText
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusScrollView}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    formData.status === status && styles.selectedStatusButton
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, status }))}
                >
                  <Text style={[
                    styles.statusButtonText,
                    formData.status === status && styles.selectedStatusButtonText
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.sectionTitle}>Mission Dates</Text>
          
          <View style={styles.dateRow}>
            <View style={styles.dateGroup}>
              <Text style={styles.label}>Start Date</Text>
              <PickerButton
                title="Select Start Date"
                value={MissionService.formatDate(startDate)}
                onPress={() => setShowStartDatePicker(true)}
              />
            </View>
            
            <View style={styles.dateGroup}>
              <Text style={styles.label}>End Date</Text>
              <PickerButton
                title="Select End Date"
                value={MissionService.formatDate(endDate)}
                onPress={() => setShowEndDatePicker(true)}
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Mission Details</Text>
          
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>PAX</Text>
              <TextInput
                style={styles.input}
                value={formData.pax}
                onChangeText={(value) => updateFormData('pax', value)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Cargo (lbs)</Text>
              <TextInput
                style={styles.input}
                value={formData.cargo}
                onChangeText={(value) => updateFormData('cargo', value)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Aircraft Type</Text>
            <TextInput
              style={styles.input}
              value={formData.aircraftType}
              onChangeText={(value) => updateFormData('aircraftType', value)}
              placeholder="e.g., C-17A, C-130J, KC-135"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => updateFormData('notes', value)}
              placeholder="Add any mission notes or special instructions..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={[styles.saveButtonText, saving && styles.disabledButtonText]}>
            {saving ? 'Creating...' : 'Create Mission'}
          </Text>
        </TouchableOpacity>
      </View>

      <DatePicker
        modal
        open={showStartDatePicker}
        date={startDate}
        mode="date"
        onConfirm={(date) => {
          setShowStartDatePicker(false);
          setStartDate(date);
          if (date > endDate) {
            setEndDate(date);
          }
        }}
        onCancel={() => setShowStartDatePicker(false)}
      />

      <DatePicker
        modal
        open={showEndDatePicker}
        date={endDate}
        mode="date"
        minimumDate={startDate}
        onConfirm={(date) => {
          setShowEndDatePicker(false);
          setEndDate(date);
        }}
        onCancel={() => setShowEndDatePicker(false)}
      />
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
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    minHeight: 100,
  },
  typeScrollView: {
    marginTop: 8,
  },
  typeButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedTypeButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
  },
  typeButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTypeButtonText: {
    color: '#ffffff',
  },
  statusScrollView: {
    marginTop: 8,
  },
  statusButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedStatusButton: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  statusButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedStatusButtonText: {
    color: '#ffffff',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateGroup: {
    flex: 1,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  pickerButtonLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  pickerButtonValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    gap: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  disabledButtonText: {
    color: '#e5e7eb',
  },
});

export default NewMissionScreen;