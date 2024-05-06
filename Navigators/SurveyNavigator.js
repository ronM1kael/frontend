import React from "react";
import { createStackNavigator } from '@react-navigation/stack'

import FirstPage from '../Screens/Survey/FirstPage';
import SecondPage from '../Screens/Survey/SecondPage';

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
                name="SecondPage"
                component={SecondPage}
                options={{
                    headerShown: false
                }}
            />

        </Stack.Navigator>
    )

}


export default SurveyNavigator;