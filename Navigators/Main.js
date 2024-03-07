import React, { useEffect, useState, useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFonts } from 'expo-font';
import HomeNavigator from "./HomeNavigator";
import Cart from "../Screens/Cart/Cart";
import CartIcon from "../Shared/CartIcon";
import CartNavigator from "./CartNavigator";
import UserNavigator from "./UserNavigator";
import AdminNavigator from "./AdminNavigator";
import Addfile from "../Screens/Admin/ProductForm";
import Admin from "../Screens/Admin/Admin";
import AnnouncementForm from "../Screens/Admin/AnnouncementForm"
import { createStackNavigator } from "@react-navigation/stack"

import Announcement from '../Screens/Product/AnnouncementContainer'

import AuthGlobal from "../Context/Store/AuthGlobal"

import UserChart from "../Screens/Admin/UserChart"
import RequestChart from "../Screens/Admin/RequestChart"

import Choose from "../Screens/User/Choose"
import Contact from "../Screens/Contact"
import Dashboard from "../Screens/Admin/Dashboard";
import Administration from "../Screens/Admin/Administration/Administration"

import ListDepartment from "../Screens/Admin/Department/ListDepartment"

import EventCalendar from "../Screens/Admin/Calendar/EventCalendar"

import { SafeAreaView } from "react-native-safe-area-context";

import ApplicationStatus from "../Screens/Certification/ApplicationStatus"
import TitleChecker from "../Screens/User/Student/TitleChecker"

import StudentApplication from "../Screens/User/Faculty/StudentApplication"

import AnnouncemmentNavigator from "../Navigators/AnnouncementNavigator"

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Main = () => {

  const context = useContext(AuthGlobal);

  const [fontsLoaded] = useFonts({
    FontAwesome: require('react-native-vector-icons/Fonts/FontAwesome.ttf'),
  });

  const handleBellPress = () => {
    console.log('Bell icon pressed!');
    // Add your logic for notification handling or other actions
  };

  if (!fontsLoaded) {
    // You can return a loading indicator or null while fonts are loading
    return null;
  }

  const AdminStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="AnnouncementForm" component={AnnouncementForm}
      />
      <Stack.Screen name="UserChart" component={UserChart}
      />
      <Stack.Screen name="RequestChart" component={RequestChart}
      />
      {/* Add more screens if needed */}
    </Stack.Navigator>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Drawer.Navigator>
        <Drawer.Screen
          name="Home"
          component={TabNavigator}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="home" size={size} color="maroon" />
            ),
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                <Image
                  source={require("../assets/tup.jpg")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Image
                  source={require("../assets/res.jpg")}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.companyName}>R&E-Services</Text>

                {context.stateUser.isAuthenticated ? (<View style={styles.bellContainer}>
                  <TouchableOpacity onPress={handleBellPress} style={styles.bellIconContainer}>
                    <Image
                      source={require("../assets/notification_bell.png")}
                      style={styles.bellIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>) : null}

              </View>
            ),
          }}
        />

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Admin' ? (
          <Drawer.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="dashboard" size={size} color="maroon" />
              ),
            }}
          />
        ) : null}

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Admin' ? (
          <Drawer.Screen
            name="Administration"
            component={Administration}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="users" size={size} color="maroon" />
              ),
            }}
          />
        ) : null}

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Admin' ? (
          <Drawer.Screen
            name="Departments"
            component={ListDepartment}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="building" size={size} color="maroon" />
              ),
            }}
          />
        ) : null}

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Admin' ? (
          <Drawer.Screen
            name="Announcements"
            component={AnnouncementForm}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="bullhorn" size={size} color="maroon" />
              ),
            }}
          />
        ) : null}

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Admin' ? (
          <Drawer.Screen
            name="Events"
            component={EventCalendar}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="calendar" size={size} color="maroon" />
              ),
            }}
          />
        ) : null}

        {context.stateUser.isAuthenticated ? null : (
          <Drawer.Screen
            name="Login"
            component={UserNavigator}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="sign-in" size={size} color="maroon" />
              ),
            }}
          />
        )}


        {context.stateUser.isAuthenticated ? null : (
          <Drawer.Screen
            name="Create Account"
            component={Choose}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="user-plus" size={size} color="maroon" />
              ),
            }}
          />
        )}

        {context.stateUser.isAuthenticated && (context.stateUser.userProfile.role === 'Student' || context.stateUser.userProfile.role === 'Faculty') ? (
          <Drawer.Screen
            name={context.stateUser.userProfile.role === 'Student' ? "Title Checker" : "Researches"}
            component={TitleChecker}
            options={{
              drawerIcon: ({ color, size }) => (
                <View style={{ justifyContent: 'center', alignItems: 'center', width: size, height: size }}>
                  <Icon name="check-circle" size={size * 0.8} color="maroon" />
                </View>
              ),
              headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                  <Image
                    source={require("../assets/res.jpg")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <Text style={styles.companyName}>R&E-Services</Text>

                </View>
              ),
            }}
          />
        ) : null}


        {context.stateUser.isAuthenticated && (context.stateUser.userProfile.role === 'Student' || context.stateUser.userProfile.role === 'Faculty') ? (
          <Drawer.Screen
            name="My Files"
            component={Addfile}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="save" size={size} color="maroon" />
              ),
              headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                  <Image
                    source={require("../assets/res.jpg")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <Text style={styles.companyName}>R&E-Services</Text>
                </View>
              ),
            }}
          />
        ) : null}



        {context.stateUser.isAuthenticated && (context.stateUser.userProfile.role === 'Student' || context.stateUser.userProfile.role === 'Faculty') ? (
          <Drawer.Screen
            name="Application Status"
            component={ApplicationStatus}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="certificate" size={size} color="maroon" />
              ),
              headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                  <Image
                    source={require("../assets/res.jpg")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <Text style={styles.companyName}>R&E-Services</Text>

                </View>
              ),
            }}
          />
        ) : null}



        {/* {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Admin' ? (
          <Drawer.Screen
            name="Admin"
            component={AdminStack}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="cog" size={size} color={color} />
              ),
            }}
          />) : null} */}

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Faculty' ? (
          <Drawer.Screen
            name="Student Application"
            component={StudentApplication}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="info-circle" size={size} color="maroon" />
              ),
              headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                  <Image
                    source={require("../assets/res.jpg")}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <Text style={styles.companyName}>R&E-Services</Text>

                </View>
              ),
            }}
          />
        ) : null}

        <Drawer.Screen
          name="About Us"
          component={Contact}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="info-circle" size={size} color="maroon" />
            ),
          }}
        />

        <Drawer.Screen
          name="Contact Us"
          component={Contact}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="envelope" size={size} color="maroon" />
            ),
          }}
        />

      </Drawer.Navigator>
    </SafeAreaView>
  );
};

const TabNavigator = ({ isLoggedIn }) => {
  const context = useContext(AuthGlobal);

  return (
    <Tab.Navigator
      initialRouteName="User"
      tabBarOptions={{
        activeTintColor: "maroon",
        showIcon: true,
        showLabel: false,
      }}
    >

      {context.stateUser.isAuthenticated ? (
        <Tab.Screen
          name="Announcement"
          component={AnnouncemmentNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon name="home" style={{ position: "relative" }} color={color} size={25} />
            ),
          }}
        />
      ) : null}

      {context.stateUser.isAuthenticated ? (
        <Tab.Screen
          name="Home"
          component={HomeNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Icon name="file-text" style={{ position: "relative" }} color={color} size={25} />
            ),
          }}
        />
      ) : null}

      {context.stateUser.isAuthenticated ? (
        <Tab.Screen
          name="Cart"
          component={CartNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <>
                <Icon
                  name="certificate"
                  style={{ position: "relative" }}
                  color={color}
                  size={25}
                />
                <CartIcon />
              </>
            ),
          }}
        />
      ) : null}

      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon name="user" style={{ position: "relative" }} color={color} size={25} />
          ),
        }}
      />

    </Tab.Navigator>
  );
};


const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'maroon',
    marginLeft: 10,
  },
  bellContainer: {
    position: 'absolute',
    width: 50,
    left: 245,
    borderLeftWidth: 2,
    borderLeftColor: 'maroon',
  },
  bellIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    width: 25,
    height: 25,
    tintColor: 'maroon',
  },
});

export default Main;
