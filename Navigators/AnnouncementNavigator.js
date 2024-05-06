import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AnnouncementList from '../Screens/Product/AnnouncementContainer';
import Events from '../Screens/Home/Events';
import Organization from '../Screens/Home/Organization';
import CertificationGuide from '../Screens/Home/CertificationGuide';

const Tab = createBottomTabNavigator();

function MyAnnouncementTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#800000', // Maroon color
        activeBackgroundColor: '#800000', // Maroon color
        inactiveBackgroundColor: '#FFFFFF',
        labelStyle: {
          fontSize: 12,
          marginBottom: Platform.OS === 'ios' ? 5 : 0,
        },
        style: {
          borderTopWidth: 1,
          borderTopColor: '#EFEFF4',
          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        },
      }}
    >
      <Tab.Screen
        name="Announcement"
        component={AnnouncementList}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="bullhorn" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="calendar" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Organization"
        component={Organization}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="building" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Certification Guide"
        component={CertificationGuide}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="book" color={color} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function CheckoutNavigator() {
  return <MyAnnouncementTabs />;
}
