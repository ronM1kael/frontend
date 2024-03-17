import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text } from 'react-native';

// Screens
import AnnouncementList from '../Screens/Product/AnnouncementContainer';
import Events from '../Screens/Home/Events';
import Organization from '../Screens/Home/Organization';
import CertificationGuide from '../Screens/Home/CertificationGuide';

import Icon from "react-native-vector-icons/FontAwesome";

const Tab = createMaterialTopTabNavigator();

function MyAnnouncementTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: "black",
                showIcon: true,
                showLabel: false,
            }} >

            <Tab.Screen
                name="Announcement"
                component={AnnouncementList}
                options={{
                    headerShown: false,
                    tabBarLabel: '', // Set tabBarLabel to an empty string
                    tabBarIcon: ({ color }) => (
                        <Icon name="bullhorn" style={{ position: "relative" }} color={color} size={25} />
                    ),
                }} />

            <Tab.Screen name="Events"
                component={Events}
                options={{
                    headerShown: false,
                    tabBarLabel: '', // Set tabBarLabel to an empty string
                    tabBarIcon: ({ color }) => (
                        <Icon name="calendar" style={{ position: "relative" }} color={color} size={25} />
                    ),
                }} />

            <Tab.Screen name="Organization"
                component={Organization}
                options={{
                    headerShown: false,
                    tabBarLabel: '', // Set tabBarLabel to an empty string
                    tabBarIcon: ({ color }) => (
                        <Icon name="building" style={{ position: "relative" }} color={color} size={25} />
                    ),
                }} />
            <Tab.Screen name="Certification Guide"
                component={CertificationGuide}
                options={{
                    headerShown: false,
                    tabBarLabel: '', // Set tabBarLabel to an empty string
                    tabBarIcon: ({ color }) => (
                        <Icon name="book" style={{ position: "relative" }} color={color} size={25} />
                    ),
                }} />
        </Tab.Navigator>
    );
}

export default function CheckoutNavigator() {
    return <MyAnnouncementTabs />;
}