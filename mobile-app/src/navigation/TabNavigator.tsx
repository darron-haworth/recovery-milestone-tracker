import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

// Import test screen
import ApiTestScreen from '../screens/test/ApiTestScreen';

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
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
        headerTitleAlign: 'center',
      }}
    >
      <Tab.Screen
        name="API Test"
        component={ApiTestScreen}
        options={{
          title: 'API Test',
          tabBarLabel: 'API Test',
        }}
      />
      <Tab.Screen
        name="Milestones"
        component={() => <PlaceholderScreen title="Milestones" />}
        options={{
          title: 'Milestones',
          tabBarLabel: 'Milestones',
        }}
      />
      <Tab.Screen
        name="Friends"
        component={() => <PlaceholderScreen title="Friends" />}
        options={{
          title: 'Friends',
          tabBarLabel: 'Friends',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={() => <PlaceholderScreen title="Profile" />}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={() => <PlaceholderScreen title="Settings" />}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
