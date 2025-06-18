import React, { useState, useEffect } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import SecurityWarningScreen from './src/screens/SecurityWarningScreen';
import HomeScreen from './src/screens/HomeScreen';
import MissionDetailsScreen from './src/screens/MissionDetailsScreen';
import NewMissionScreen from './src/screens/NewMissionScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Types
export type RootStackParamList = {
  SecurityWarning: undefined;
  Home: undefined;
  MissionDetails: { missionId: number };
  NewMission: undefined;
  Statistics: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [hasAcceptedSecurity, setHasAcceptedSecurity] = useState<boolean | null>(null);
  const scheme = useColorScheme();

  useEffect(() => {
    checkSecurityAcceptance();
  }, []);

  const checkSecurityAcceptance = async () => {
    try {
      const accepted = await AsyncStorage.getItem('security_warning_accepted');
      const timestamp = await AsyncStorage.getItem('security_warning_timestamp');
      
      if (accepted && timestamp) {
        const acceptedTime = parseInt(timestamp);
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        
        if (acceptedTime > thirtyDaysAgo) {
          setHasAcceptedSecurity(true);
          return;
        }
      }
      
      setHasAcceptedSecurity(false);
    } catch (error) {
      console.error('Error checking security acceptance:', error);
      setHasAcceptedSecurity(false);
    }
  };

  const handleSecurityAccepted = async () => {
    try {
      await AsyncStorage.setItem('security_warning_accepted', 'true');
      await AsyncStorage.setItem('security_warning_timestamp', Date.now().toString());
      setHasAcceptedSecurity(true);
    } catch (error) {
      console.error('Error saving security acceptance:', error);
    }
  };

  if (hasAcceptedSecurity === null) {
    return null; // Loading state
  }

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <Stack.Navigator
        initialRouteName={hasAcceptedSecurity ? 'Home' : 'SecurityWarning'}
        screenOptions={{
          headerStyle: {
            backgroundColor: scheme === 'dark' ? '#1f2937' : '#f3f4f6',
          },
          headerTintColor: scheme === 'dark' ? '#ffffff' : '#000000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!hasAcceptedSecurity ? (
          <Stack.Screen
            name="SecurityWarning"
            options={{ headerShown: false }}
          >
            {() => <SecurityWarningScreen onAccept={handleSecurityAccepted} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'AMC Mission Tracker' }}
            />
            <Stack.Screen
              name="MissionDetails"
              component={MissionDetailsScreen}
              options={{ title: 'Mission Details' }}
            />
            <Stack.Screen
              name="NewMission"
              component={NewMissionScreen}
              options={{ title: 'New Mission' }}
            />
            <Stack.Screen
              name="Statistics"
              component={StatisticsScreen}
              options={{ title: 'Flight Statistics' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;