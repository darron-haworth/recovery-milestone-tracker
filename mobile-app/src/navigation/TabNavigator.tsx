import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// Import screens
import FriendsScreen from '../screens/friends/FriendsScreen';
import MilestonesScreen from '../screens/milestones/MilestonesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';


// Placeholder screens
const PlaceholderScreen: React.FC<{ title: string }> = ({ title }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{title} Screen</Text>
    <Text>Coming soon...</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Milestones"
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5EA',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        headerStyle: {
          backgroundColor: '#757575', // Even lighter gray
          height: 40, // Increased height to accommodate positioning
          paddingTop: 0, // Remove space above text
          paddingBottom: 0, // Remove default bottom padding
        },
        headerTintColor: '#FFFFFF', // White text
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 12, // Minimal font size for ultra-compact header
          fontWeight: '500',
          color: '#FFFFFF', // White text
          marginTop: -10, // Move text up
          marginBottom: 10, // Add space below text
        },
      }}
    >
      <Tab.Screen
        name="Milestones"
        component={MilestonesScreen}
        options={{
          title: 'Our Time Recovered - Milestones',
          tabBarLabel: 'Milestones',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="emoji-events" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          title: 'Our Time Recovered - Friends',
          tabBarLabel: 'Friends',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Our Time Recovered - Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Our Time Recovered - Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
