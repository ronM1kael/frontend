import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import ProductContainer from '../Screens/Product/ProductContainer'
import SingleProduct from '../Screens/Product/SingleProduct'
import AnnouncementContainer from '../Screens/Product/AnnouncementContainer';

const Stack = createStackNavigator()
function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Product'
                component={ProductContainer}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name='Product Detail'
                component={SingleProduct}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name='Announcement'
                component={AnnouncementContainer}
                options={{
                    headerShown: false,
                }}
            />

        </Stack.Navigator>
    )
}

export default function HomeNavigator() {
    return <MyStack />;
}