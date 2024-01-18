import React from "react";
import { createStackNavigator } from '@react-navigation/stack'

import Login from "../Screens/User/Login";
import Register from "../Screens/User/Register";
import UserProfile from "../Screens/User/UserProfile";
import Choose from "../Screens/User/Choose";
import RegisterFacultyMember from "../Screens/User/RegisterFacultyMember";
import RegisterStaff from "../Screens/User/RegisterStaff";
import EditProfile from "../Screens/User/EditProfile";
import FacultyUserProfile from "../Screens/User/FacultyUserProfile";
import StaffUserProfile from "../Screens/User/StaffUserProfile";
import FacultyEditProfile from "../Screens/User/FacultyEditProfile"
import StaffEditProfile from "../Screens/User/StaffEditProfile"

const Stack = createStackNavigator();

const UserNavigator = ({ isLoggedIn }) => {
    return (
        <Stack.Navigator>

            {!isLoggedIn && (
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />
            )}

            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="Choose"
                component={Choose}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="User Profile"
                component={UserProfile}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="Faculty Profile"
                component={FacultyUserProfile}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="Staff Profile"
                component={StaffUserProfile}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="FacultyEditProfile"
                component={FacultyEditProfile}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="StaffEditProfile"
                component={StaffEditProfile}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="RegisterFacultyMember"
                component={RegisterFacultyMember}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="RegisterStaff"
                component={RegisterStaff}
                options={{
                    headerShown: false
                }}
            />

        </Stack.Navigator>
    )

}


export default UserNavigator;