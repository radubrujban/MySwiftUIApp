import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { MissionService } from '../services/MissionService';
import { Mission } from '../types/Mission';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      const missionData = await MissionService.getAllMissions();
      setMissions(missionData);
    } catch (error) {
      console.error('Error loading missions:', error);
      Alert.alert('Error', 'Failed to load missions');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMissions();
    setRefreshing(false);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const MissionCard: React.FC<{ mission: Mission }> = ({ mission }) => (
    <TouchableOpacity
      style={styles.missionCard}
      onPress={() => navigation.navigate('MissionDetails', { missionId: mission.id })}
    >
      <View style={styles.missionHeader}>
        <Text style={styles.missionNumber}>{mission.missionNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(mission.status) }]}>
          <Text style={styles.statusText}>{mission.status}</Text>
        </View>
      </View>
      
      <Text style={styles.missionType}>{mission.missionType}</Text>
      <Text style={styles.dateRange}>{mission.dateRange}</Text>
      
      <View style={styles.missionStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{mission.legs}</Text>
          <Text style={styles.statLabel}>Legs</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{mission.pax}</Text>
          <Text style={styles.statLabel}>PAX</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{mission.cargo}</Text>
          <Text style={styles.statLabel}>Cargo (lbs)</Text>
        </View>
        {mission.totalFlightHours && (
          <View style={styles.stat}>
            <Text style={styles.statValue}>{mission.totalFlightHours.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AMC Mission Tracker</Text>
        <Text style={styles.headerSubtitle}>Air Mobility Command Operations</Text>
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.newMissionButton}
          onPress={() => navigation.navigate('NewMission')}
        >
          <Text style={styles.newMissionButtonText}>+ New Mission</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text style={styles.statsButtonText}>📊 Statistics</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading missions...</Text>
          </View>
        ) : missions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No missions found</Text>
            <Text style={styles.emptyText}>
              Tap "New Mission" to create your first mission
            </Text>
          </View>
        ) : (
          <View style={styles.missionsList}>
            {missions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navButton, styles.activeNavButton]}
          onPress={() => {}}
        >
          <Text style={[styles.navButtonText, styles.activeNavButtonText]}>🏠 Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text style={styles.navButtonText}>📊 Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.navButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  actionBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  newMissionButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  newMissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statsButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  missionsList: {
    padding: 16,
  },
  missionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  missionType: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  missionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 20,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeNavButton: {
    backgroundColor: '#f3f4f6',
  },
  navButtonText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  activeNavButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

export default HomeScreen;