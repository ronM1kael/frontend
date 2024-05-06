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
import Researches from "../Screens/User/Faculty/Researches"

import ResearchTemplatesScreen from "../Screens/User/Faculty/ResearchTemplates";
import ExtensionTemplatesScreen from "../Screens/User/Faculty/ExtensionTemplates";

import FacultyApplication from "../Screens/Extend/FacultyExtension"

import ResearchProposal from "../Screens/User/Faculty/ResearchProposal";
import ExtensionApplicationStatus from "../Screens/Extend/ExtensionApplicationStatus";
import SurveyNavigator from '../Navigators/SurveyNavigator';
import AssessmentNavigator from '../Navigators/AssessmentNavigator';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const Main = () => {

  const context = useContext(AuthGlobal);

  const [fontsLoaded] = useFonts({
    FontAwesome: require('react-native-vector-icons/Fonts/FontAwesome.ttf'),
  });

  const TemplatesScreen = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Templates"
        component={TemplatesDropdown}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Research Template"
        component={ResearchTemplatesScreen}
      />
      <Stack.Screen
        name="Extension Template"
        component={ExtensionTemplatesScreen}
      />
    </Stack.Navigator>
  );

  const handleBellPress = () => {
    console.log('Bell icon pressed!');
    // Add your logic for notification handling or other actions
  };

  const TemplatesDropdown = ({ navigation }) => {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ paddingHorizontal: 15 }}>
          <TouchableOpacity
            style={[
              styles.buttons,
              styles.infoButtons,
            ]}
            onPress={() => navigation.navigate('Research Template')}
          >
            <Text style={styles.buttonTexts}>Research Template</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttons,
              styles.dangerButtons,
            ]}
            onPress={() => navigation.navigate('Extension Template')}
          >
            <Text style={styles.buttonTexts}>Extension Template</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
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
              <Icon name="home" size={size} color="#333" />
            ),
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
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
                <Icon name="dashboard" size={size} color="#333" />
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
                <Icon name="users" size={size} color="#333" />
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
                <Icon name="building" size={size} color="#333" />
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
                <Icon name="bullhorn" size={size} color="#333" />
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
                <Icon name="calendar" size={size} color="#333" />
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
                <Icon name="sign-in" size={size} color="#333" />
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
        )}


        {context.stateUser.isAuthenticated ? null : (
          <Drawer.Screen
            name="Create Account"
            component={Choose}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="user-plus" size={size} color="#333" />
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
        )}

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Student' ? (
          <Drawer.Screen
            name="Title Checker"
            component={TitleChecker}
            options={{
              drawerIcon: ({ color, size }) => (
                <View style={{ justifyContent: 'center', alignItems: 'center', width: size, height: size }}>
                  <Icon name="check-circle" size={size * 0.8} color="#333" />
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
            name="My Applications"
            component={Addfile}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="save" size={size} color="#333" />
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
                <Icon name="list" size={size} color="#333" />
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

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Faculty' ? (
          <Drawer.Screen
            name="Research Proposal"
            component={ResearchProposal}
            options={{
              drawerIcon: ({ color, size }) => (
                <View style={{ justifyContent: 'center', alignItems: 'center', width: size, height: size }}>
                  <Icon name="file-code-o" size={size * 0.8} color="#333" />
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

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Faculty' ? (
          <Drawer.Screen
            name="Student Application"
            component={StudentApplication}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="file-pdf-o" size={size} color="#333" />
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

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Faculty' ? (
          <Drawer.Screen
            name="Researches"
            component={Researches}
            options={{
              drawerIcon: ({ color, size }) => (
                <View style={{ justifyContent: 'center', alignItems: 'center', width: size, height: size }}>
                  <Icon name="book" size={size * 0.8} color="#333" />
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

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Faculty' ? (
          <Drawer.Screen
            name="Templates"
            component={TemplatesScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <View style={{ justifyContent: 'center', alignItems: 'center', width: size, height: size }}>
                  <Icon name="file-archive-o" size={size * 0.8} color="#333" />
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

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Faculty' ? (
          <Drawer.Screen
            name="Extension Application"
            component={FacultyApplication}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="th-list" size={size} color="#333" />
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

        {context.stateUser.isAuthenticated && context.stateUser.userProfile.role === 'Faculty' ? (
          <Drawer.Screen
            name="Extension Application Status"
            component={ExtensionApplicationStatus}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="th-list" size={size} color="#333" />
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
              <Icon name="info-circle" size={size} color="#333" />
            ),
          }}
        />

        <Drawer.Screen
          name="Contact Us"
          component={Contact}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="envelope" size={size} color="#333" />
            ),
          }}
        />

        <Drawer.Screen
          name="SurveyNavigator"
          component={SurveyNavigator}
          options={{
            drawerIcon: ({ color, size }) => null,
            drawerLabel: '',
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

        <Drawer.Screen
          name="AssessmentNavigator"
          component={AssessmentNavigator}
          options={{
            drawerIcon: ({ color, size }) => null,
            drawerLabel: '',
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
        activeTintColor: "#333",
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
              <Icon name="home" style={{ position: "relative" }} color="#333" size={25} />
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
              <Icon name="file-text" style={{ position: "relative" }} color="#333" size={25} />
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
                  color="#333"
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
            <Icon name="user" style={{ position: "relative" }} color="#333" size={25} />
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
    color: '#333',
    marginLeft: 10,
  },
  bellContainer: {
    position: 'absolute',
    width: 50,
    left: 245,
    borderLeftWidth: 2,
    borderLeftColor: '#333',
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
    tintColor: '#333',
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 60,
    borderRadius: 30,
    borderWidth: 0.2,
    borderColor: '#eee',
    borderBottomWidth: 8,
    marginVertical: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  infoButtons: {
    backgroundColor: '#2196f3',
    borderColor: '#0e3860',
    shadowColor: '#1c5da6',
  },
  dangerButtons: {
    backgroundColor: '#f44336',
    borderColor: '#c4211d',
    shadowColor: '#1c5da6',
  },
  buttonTexts: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Main;