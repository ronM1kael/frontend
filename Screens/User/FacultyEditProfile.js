import React, { useState, useContext, useCallback, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Pressable, Modal, TouchableWithoutFeedback } from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from 'expo-checkbox';
import Button from '../../Components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import COLORS from '../../Constants/color';

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// import { GoogleSignin } from '@react-native-google-signin/google-signin';

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthGlobal from "../../Context/Store/AuthGlobal"

WebBrowser.maybeCompleteAuthSession();

const EditProfile = (props) => {

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [mname, setMName] = useState("");
    const [tup_id, setTUPID] = useState("");
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");
    const [designation, setDesignation] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const [error, setError] = useState("");
    const navigation = useNavigation();

    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    const showDatePicker = () => {
        setShow(true);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const formatDateForDatabase = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
    };

    const [selectedGender, setSelectedGender] = useState('');

    const [isTextInputDisable] = useState(false);

    const closeModal = () => {
        setIsModalVisible(false);
    };

    //Edit Profile
    const [faculty, setProfileData] = useState(null);
    const context = useContext(AuthGlobal);
    // const navigation = useNavigation();

    useEffect(() => {
        const fetchFacultyData = async () => {
            try {
                const jwtToken = await AsyncStorage.getItem('jwt');

                if (jwtToken && context.stateUser.isAuthenticated) {
                    const userProfile = context.stateUser.userProfile;

                    if (userProfile && userProfile.id) {
                        const response = await axios.get(
                            `${baseURL}facultyprofile/${userProfile.id}`,
                            {
                                headers: { Authorization: `Bearer ${jwtToken}` },
                            }
                        );
                        setProfileData(response.data);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchFacultyData();
    }, [context.stateUser.isAuthenticated, context.stateUser.userProfile]);


    const handleProfileUpdate = async () => {
        try {
            const jwtToken = await AsyncStorage.getItem('jwt');
            const userProfile = context.stateUser.userProfile;

            if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
                setError("User authentication or profile information is missing");
                return;
            }

            const userId = userProfile.id;

            const profileData = {
                fname: fname,
                lname: lname,
                mname: mname,
                department: department,
                position: position,
                designation: designation,
                tup_id: tup_id,
                gender: selectedGender,
                phone: phone,
                address: address,
                user_id: userId
            };

            console.log(profileData);

            const response = await axios.put(`${baseURL}facultys/profiles/${userId}`, profileData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json", // Change the content type to JSON
                    Authorization: `Bearer ${jwtToken}`,
                },
            });

            console.log("Profile updated successfully", response.data);
            Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Profile updated successfully.",
                text2: "You can now view your updated profile.",
            });
            navigation.navigate("Faculty Profile");
            // navigation logic after profile update
            //
        } catch (error) {
            console.error("Error updating profile:", error.response);
            setError("Error updating profile. Please try again.");
            Toast.show({
                position: 'bottom',
                bottomOffset: 20,
                type: "error",
                text1: "Error updating profile.",
                text2: "Please try again.",
            });
        }
    };




    useEffect(() => {
        if (faculty) {
            setLName(faculty.lname);
            setFName(faculty.fname);
            setMName(faculty.mname);
            setTUPID(faculty.tup_id);
            setDepartment(faculty.department);
            setPosition(faculty.position);
            setDesignation(faculty.designation);
            setAddress(faculty.address);
            setPhone(faculty.phone);
            setSelectedDate(faculty.selectedDate)



            // Set other fields as needed
        }
    }, [faculty]);

    // console.log(student);

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (event, newDate) => {
        const currentDate = newDate || date;
        setSelectedDate(currentDate);
        setShow(false);
    };

    const [pickerClicked, setPickerClicked] = useState(false);
    const handlePickerClick = () => {
        setPickerClicked(true);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <KeyboardAwareScrollView
                    viewIsInsideTabBar={true}
                    extraHeight={200}
                    enableOnAndroid={true}
                >

                    <View style={{ marginVertical: 22 }}>
                        <Text style={{
                            fontSize: 22,
                            fontWeight: 'bold',
                            marginVertical: 12,
                            color: COLORS.black
                        }}>
                            Edit Faculty Profile
                        </Text>

                    </View>

                    {/* nagana pero pang full name */}
                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/ios/50/name--v1.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Last Name</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: '#800000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>

                            <TextInput
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"lname"}
                                id={"lname"}
                                onChangeText={(text) => setLName(text)}
                                value={lname}
                            >
                            </TextInput>
                        </View>
                    </View>

                    {/* di pa nagana */}
                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/ios/50/name--v1.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>First Name</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: '#800000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"fname"}
                                id={"fname"}
                                onChangeText={(text) => setFName(text)}
                                value={fname}
                            >
                            </TextInput>
                        </View>
                    </View>

                    {/* di pa nagana */}
                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/ios/50/name--v1.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Middle Name</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: '#800000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"mname"}
                                id={"mname"}
                                onChangeText={(text) => setMName(text)}
                                value={mname}
                            >
                            </TextInput>
                        </View>
                    </View>

                    {/* di pa nagana */}
                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/external-outline-astudio/32/external-school-high-school-outline-astudio-9.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>TUP ID</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: '#800000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                editable={isTextInputDisable}
                                placeholder='ex: TUPT-##-####'
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "40%",
                                    borderRightWidth: 1,
                                    borderLeftColor: COLORS.grey,
                                    height: "100%"
                                }}

                            />

                            <TextInput
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "50%"
                                }}
                                name={"tup_id"}
                                id={"tup_id"}
                                onChangeText={(text) => setTUPID(text)}
                                value={tup_id}
                            >
                            </TextInput>
                        </View>
                    </View>

                    {/* di pa nagana */}
                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/ios/50/department.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Department</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: '#800000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput

                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"department"}
                                id={"department"}
                                onChangeText={(text) => setDepartment(text)}
                                value={department}
                            />
                        </View>
                    </View>

                    {/* DI PA NAGANA */}
                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/windows/32/point-objects.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Position</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: '#800000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput

                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"position"}
                                id={"position"}
                                onChangeText={(text) => setPosition(text)}
                                value={position}
                            />
                        </View>
                    </View>

                    {/* DI PA NAGANA */}
                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/external-glyph-geotatah/64/external-designation-estate-planning-glyph-glyph-geotatah.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Designation</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: '#800000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput

                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"designation"}
                                id={"designation"}
                                onChangeText={(text) => setDesignation(text)}
                                value={designation}
                            />
                        </View>
                    </View>

                    {/* di nagana */}
                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/ios/50/address--v1.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Address</Text>

                        <View style={{
                            width: "100%",
                            height: 100,
                            borderColor: '#800000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"address"}
                                id={"address"}
                                onChangeText={(text) => setAddress(text)}
                                value={address}
                            >
                            </TextInput>
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/carbon-copy/100/1-c.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Mobile Number</Text>

                        <View style={{
                            width: "100%",
                            height: 48,
                            borderColor: '#800000',
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingLeft: 22
                        }}>
                            <TextInput
                                editable={isTextInputDisable}
                                placeholder='+63'
                                placeholderTextColor={COLORS.black}
                                keyboardType='numeric'
                                style={{
                                    width: "12%",
                                    borderRightWidth: 1,
                                    borderLeftColor: COLORS.grey,
                                    height: "100%"
                                }}
                            />

                            <TextInput
                                placeholderTextColor={COLORS.black}
                                name={"phone"}
                                id={"phone"}
                                keyboardType='numeric'
                                onChangeText={(text) => setPhone(text)}
                                style={{
                                    width: "80%"
                                }}
                                value={phone}
                            >
                            </TextInput>
                        </View>
                    </View>

                    {/* <View style={styles.buttonGroup}>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </View> */}

                    {/* <Modal
                    animationType='slide'
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{error}</Text>
                        <TouchableOpacity onPress={closeModal} style={[styles.modalButton, { backgroundColor: 'maroon' }]}>
                        <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </Modal> */}

                    <Button
                        large primary onPress={() => handleProfileUpdate()}
                        title="Save"
                        filled
                        style={{
                            marginTop: 18,
                            marginBottom: 4,
                        }}
                    />

                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        marginBottom: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalText: {
        marginBottom: 16,
        fontSize: 18,
    },
    modalButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    buttonGroup: {
        width: "80%",
        margin: 10,
        alignItems: "center",
    },
    datePicker: {
        width: '100%',
    },
    icon: {
        width: 30,
        height: 30,
    },
    inputIcon: {
        marginLeft: `0`,
        justifyContent: 'center',
    },
});

export default EditProfile;