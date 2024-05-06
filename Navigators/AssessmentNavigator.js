import React from "react";
import { createStackNavigator } from '@react-navigation/stack'

import FirstPage from '../Screens/Assessment/FirstPage';
import SecondPage2 from '../Screens/Assessment/SecondPage';

const Stack = createStackNavigator();

const SurveyNavigator = () => {
    return (
        <Stack.Navigator>

            <Stack.Screen
                name="FirstPage"
                component={FirstPage}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="SecondPage2"
                component={SecondPage2}
                options={{
                    headerShown: false
                }}
            />

        </Stack.Navigator>
    )

}


export default SurveyNavigator;