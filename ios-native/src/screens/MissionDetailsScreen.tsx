import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { MissionService } from '../services/MissionService';
import { Mission, FlightLeg } from '../types/Mission';
import { DistanceCalculator } from '../services/DistanceCalculator';

type MissionDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MissionDetails'>;
type MissionDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MissionDetails'>;

const MissionDetailsScreen: React.FC = () => {
  const navigation = useNavigation<MissionDetailsScreenNavigationProp>();
  const route = useRoute<MissionDetailsScreenRouteProp>();
  const { missionId } = route.params;

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    loadMission();
  }, [missionId]);

  const loadMission = async () => {
    try {
      const missionData = await MissionService.getMission(missionId);
      if (missionData) {
        setMission(missionData);
        setNotes(missionData.notes || '');
      } else {
        Alert.alert('Error', 'Mission not found');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading mission:', error);
      Alert.alert('Error', 'Failed to load mission details');
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async () => {
    if (!mission) return;

    try {
      const updatedMission = { ...mission, notes };
      await MissionService.saveMission(updatedMission);
      setMission(updatedMission);
      setIsEditingNotes(false);
      Alert.alert('Success', 'Notes saved successfully');
    } catch (error) {
      console.error('Error saving notes:', error);
      Alert.alert('Error', 'Failed to save notes');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return '#3b82f6';
      case 'Planning': return '#f59e0b';
      case 'Deployment': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const FlightLegCard: React.FC<{ leg: FlightLeg }> = ({ leg }) => (
    <View style={styles.legCard}>
      <View style={styles.legHeader}>
        <Text style={styles.legNumber}>Leg {leg.legNumber}</Text>
        <Text style={styles.flightHours}>{leg.flightHours.toFixed(1)}h</Text>
      </View>
      
      <View style={styles.routeContainer}>
        <Text style={styles.airport}>{leg.departure}</Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.airport}>{leg.arrival}</Text>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{leg.departureTime} - {leg.arrivalTime}</Text>
      </View>
      
      {leg.distanceNm && (
        <Text style={styles.distance}>{leg.distanceNm.toFixed(0)} nm</Text>
      )}
      
      <View style={styles.legStats}>
        <View style={styles.legStat}>
          <Text style={styles.legStatLabel}>PAX</Text>
          <Text style={styles.legStatValue}>{leg.pax || 0}</Text>
        </View>
        <View style={styles.legStat}>
          <Text style={styles.legStatLabel}>Cargo</Text>
          <Text style={styles.legStatValue}>{leg.cargo || 0}</Text>
        </View>
        {leg.tailNumber && (
          <View style={styles.legStat}>
            <Text style={styles.legStatLabel}>Tail</Text>
            <Text style={styles.legStatValue}>{leg.tailNumber}</Text>
          </View>
        )}
      </View>
      
      {leg.remarks && (
        <Text style={styles.remarks}>{leg.remarks}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading mission details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!mission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Mission not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.missionHeader}>
            <Text style={styles.missionNumber}>{mission.missionNumber}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(mission.status) }]}>
              <Text style={styles.statusText}>{mission.status}</Text>
            </View>
          </View>
          
          <Text style={styles.missionType}>{mission.missionType}</Text>
          <Text style={styles.dateRange}>{mission.dateRange}</Text>
          
          {mission.aircraftType && (
            <Text style={styles.aircraftType}>Aircraft: {mission.aircraftType}</Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{mission.legs}</Text>
            <Text style={styles.statLabel}>Flight Legs</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{mission.pax}</Text>
            <Text style={styles.statLabel}>Total PAX</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{mission.cargo}</Text>
            <Text style={styles.statLabel}>Cargo (lbs)</Text>
          </View>
          {mission.totalFlightHours && (
            <View style={styles.stat}>
              <Text style={styles.statValue}>{mission.totalFlightHours.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Flight Hours</Text>
            </View>
          )}
        </View>

        {mission.flightLegs && mission.flightLegs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Flight Legs</Text>
            {mission.flightLegs.map((leg) => (
              <FlightLegCard key={leg.id} leg={leg} />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.notesHeader}>
            <Text style={styles.sectionTitle}>Mission Notes</Text>
            <TouchableOpacity
              onPress={() => setIsEditingNotes(!isEditingNotes)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {isEditingNotes ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {isEditingNotes ? (
            <View>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add mission notes..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity onPress={saveNotes} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Notes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.notesText}>
              {notes || 'No notes added for this mission.'}
            </Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  missionType: {
    fontSize: 18,
    color: '#374151',
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  aircraftType: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  legCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  legHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  legNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  flightHours: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  airport: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  arrow: {
    fontSize: 16,
    color: '#6b7280',
    marginHorizontal: 8,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  distance: {
    fontSize: 14,
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  legStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legStat: {
    alignItems: 'center',
  },
  legStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  legStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  remarks: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    fontStyle: 'italic',
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  notesText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
});

export default MissionDetailsScreen;