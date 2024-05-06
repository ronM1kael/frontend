import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/FontAwesome";

// Screens
import Checkout from '../Screens/Cart/Checkout/Checkout';
import Payment from '../Screens/Cart/Checkout/Payment';
import Confirm from '../Screens/Cart/Checkout/Confirm';

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#007bff', // Color of selected tab
                inactiveTintColor: '#aaa', // Color of inactive tabs
                labelStyle: {
                    fontSize: 12, // Font size of tab labels
                    marginBottom: 5, // Bottom margin of tab labels
                },
                style: {
                    backgroundColor: '#fff', // Background color of the tab bar
                    borderTopWidth: 1, // Top border width of the tab bar
                    borderTopColor: '#eee', // Top border color of the tab bar
                    height: 60, // Height of the tab bar
                    paddingBottom: 5, // Bottom padding of the tab bar
                },
            }}
        >
            <Tab.Screen
                name="Details"
                component={Checkout}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Details',
                    tabBarIcon: ({ color }) => (
                        <Icon name="info-circle" size={20} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Researchers"
                component={Payment}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Researchers',
                    tabBarIcon: ({ color }) => (
                        <Icon name="users" size={20} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Confirm"
                component={Confirm}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Confirm',
                    tabBarIcon: ({ color }) => (
                        <Icon name="check-circle" size={20} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function CheckoutNavigator() {
    return <MyTabs />;
}
