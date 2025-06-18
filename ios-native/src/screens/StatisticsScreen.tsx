import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { MissionService } from '../services/MissionService';
import { FlightStatistics } from '../types/Mission';

const StatisticsScreen: React.FC = () => {
  const [statistics, setStatistics] = useState<FlightStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const stats = await MissionService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
      Alert.alert('Error', 'Failed to load flight statistics');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatistics();
    setRefreshing(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
  }> = ({ title, value, subtitle, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!statistics) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load statistics</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Flight Statistics</Text>
          <Text style={styles.headerSubtitle}>
            Your Air Mobility Command mission performance
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.primaryStats}>
            <StatCard
              title="Total Flight Hours"
              value={statistics.totalFlightHours.toFixed(1)}
              subtitle="hours"
              color="#3b82f6"
            />
            
            <StatCard
              title="Total Distance"
              value={formatNumber(statistics.totalDistanceNm)}
              subtitle="nautical miles"
              color="#10b981"
            />
          </View>

          <View style={styles.primaryStats}>
            <StatCard
              title="Missions Completed"
              value={statistics.missionsCompleted}
              subtitle="successful missions"
              color="#8b5cf6"
            />
            
            <StatCard
              title="Average Flight Time"
              value={statistics.averageFlightHours.toFixed(1)}
              subtitle="hours per mission"
              color="#f59e0b"
            />
          </View>

          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Cargo & Personnel</Text>
          </View>

          <View style={styles.primaryStats}>
            <StatCard
              title="Total PAX Moved"
              value={formatNumber(statistics.totalPaxMoved)}
              subtitle="passengers"
              color="#ef4444"
            />
            
            <StatCard
              title="Total Cargo Moved"
              value={formatNumber(statistics.totalCargoMoved)}
              subtitle="pounds"
              color="#06b6d4"
            />
          </View>

          <View style={styles.sectionTitle}>
            <Text style={styles.sectionTitleText}>Flight Records</Text>
          </View>

          <StatCard
            title="Longest Single Flight"
            value={statistics.longestFlight.toFixed(1)}
            subtitle="hours"
            color="#dc2626"
          />

          <StatCard
            title="Most Frequent Route"
            value={statistics.mostFrequentRoute}
            subtitle="ICAO airport codes"
            color="#7c3aed"
          />

          {statistics.totalFlightHours > 0 && (
            <View style={styles.achievementContainer}>
              <Text style={styles.achievementTitle}>🏆 Achievements</Text>
              
              <View style={styles.achievementsList}>
                {statistics.totalFlightHours >= 100 && (
                  <View style={styles.achievement}>
                    <Text style={styles.achievementIcon}>✈️</Text>
                    <Text style={styles.achievementText}>Century Club - 100+ Flight Hours</Text>
                  </View>
                )}
                
                {statistics.missionsCompleted >= 10 && (
                  <View style={styles.achievement}>
                    <Text style={styles.achievementIcon}>🎯</Text>
                    <Text style={styles.achievementText}>Mission Expert - 10+ Completed Missions</Text>
                  </View>
                )}
                
                {statistics.totalDistanceNm >= 50000 && (
                  <View style={styles.achievement}>
                    <Text style={styles.achievementIcon}>🌍</Text>
                    <Text style={styles.achievementText}>Global Reach - 50,000+ Nautical Miles</Text>
                  </View>
                )}
                
                {statistics.totalCargoMoved >= 100000 && (
                  <View style={styles.achievement}>
                    <Text style={styles.achievementIcon}>📦</Text>
                    <Text style={styles.achievementText}>Cargo Master - 100,000+ Pounds Moved</Text>
                  </View>
                )}
                
                {statistics.totalPaxMoved >= 1000 && (
                  <View style={styles.achievement}>
                    <Text style={styles.achievementIcon}>👥</Text>
                    <Text style={styles.achievementText}>People Mover - 1,000+ Passengers</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Statistics are calculated from all completed missions in your logbook.
              Data is updated automatically when missions are created or modified.
            </Text>
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
  statsContainer: {
    padding: 16,
  },
  primaryStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  sectionTitle: {
    marginVertical: 20,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  achievementContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default StatisticsScreen;