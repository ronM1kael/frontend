import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Pressable, Modal } from "react-native";
import { useNavigation } from '@react-navigation/native';
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

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const Register = (props) => {

    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [mname, setMName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [college, setCollege] = useState("");
    const [course, setCourse] = useState("");
    const [tup_id, setTUPID] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [selectedGender, setSelectedGender] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isTextInputDisable, setIsTextInputDisable] = useState(false); // Added state
    const navigation = useNavigation();

    const formatDateForDatabase = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
    };

    const showToast = (message, type) => {
        Toast.show({
            type: type,
            text1: message,
        });
    };

    const register = async () => {
        if (!fname || !lname || !mname || !email || !password || !course || !tup_id || !selectedGender || !phone || !address || !date) {
            setError("Please fill in the form correctly");
            setIsModalVisible(true);
            return;
        }

        const user = {
            fname,
            lname,
            mname,
            email,
            password,
            role: "Student",
            college,
            course,
            tup_id,
            gender: selectedGender,
            phone,
            address,
            birthdate: formatDateForDatabase(date),
        };

        try {
            const res = await axios.post(`${baseURL}students/register`, user);
            if (res.status === 200) {
                showToast("Registration succeeded. Please login to your account.", 'success');
                setTimeout(() => {
                    navigation.navigate("Login");
                }, 500);
            }
        } catch (error) {
            showToast("Something went wrong. Please try again.", 'error');
            console.log(error);
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const showDatePicker = () => {
        setShow(true);
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
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
                            fontSize: 24,
                            fontWeight: 'bold',
                            marginBottom: 12,
                            color: '#000',
                            textAlign: 'center'
                        }}>
                            New Student Profile Creation
                        </Text>

                        <Text style={{
                            fontSize: 18,
                            color: '#000',
                            textAlign: 'center'
                        }}>
                            Note: All students must be enrolled in Technological University of Philippines - Taguig Campus. please enter the student ID number and use TUP Email only.
                        </Text>
                    </View>

                    {/* nagana pero pang full name */}
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]} // Changed tintColor to maroon
                                source={{ uri: 'https://img.icons8.com/ios/50/name--v1.png' }}
                            />
                            {' '}
                            Last Name
                        </Text>
                        <View style={{
                            width: '100%',
                            height: 48,
                            borderColor: 'black', // Changed borderColor to maroon
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Enter your Last Name'
                                placeholderTextColor='black' // Changed placeholderTextColor to maroon
                                keyboardType='default'
                                style={{
                                    width: '100%',
                                    fontSize: 16
                                }}
                                name='lname'
                                id='lname'
                                onChangeText={(text) => setLName(text)}
                            />
                        </View>
                    </View>

                    {/* di pa nagana */}
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]}
                                source={{ uri: 'https://img.icons8.com/ios/50/name--v1.png' }}
                            />
                            {' '} {/* Adding a space here */}
                            First Name
                        </Text>
                        <View style={{
                            width: '100%',
                            height: 48,
                            borderColor: 'black', // Changed borderColor to maroon
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Enter your First Name'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                keyboardType='default'
                                style={{
                                    width: '100%',
                                    fontSize: 16
                                }}
                                name='fname'
                                id='fname'
                                onChangeText={(text) => setFName(text)}
                            />
                        </View>
                    </View>

                    {/* di pa nagana */}
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]}
                                source={{ uri: 'https://img.icons8.com/ios/50/name--v1.png' }}
                            />
                            {' '} {/* Adding a space here */}
                            Middle Name
                        </Text>
                        <View style={{
                            width: '100%',
                            height: 48,
                            borderColor: 'black', // Changed borderColor to maroon
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Enter your Middle Name'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                keyboardType='default'
                                style={{
                                    width: '100%',
                                    fontSize: 16
                                }}
                                name='mname'
                                id='mname'
                                onChangeText={(text) => setMName(text)}
                            />
                        </View>
                    </View>

                    {/* di pa nagana */}
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]}
                                source={{ uri: 'https://img.icons8.com/external-outline-astudio/32/external-school-high-school-outline-astudio-9.png' }}
                            />
                            {' '} {/* Adding a space here */}
                            TUP ID
                        </Text>
                        <View style={{
                            width: '100%',
                            height: 48,
                            borderColor: 'black', // Changed borderColor to maroon
                            borderWidth: 1,
                            borderRadius: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingLeft: 22
                        }}>
                            <TextInput
                                editable={isTextInputDisable}
                                placeholder='TUPT-##-####'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                keyboardType='text'
                                style={{
                                    width: '40%',
                                    borderRightWidth: 1,
                                    borderLeftColor: 'gray', // Changed borderLeftColor to gray
                                    height: '100%',
                                    fontSize: 16
                                }}
                            />
                            <TextInput
                                placeholder='Enter your TUP ID'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                // keyboardType='numeric' // Changed keyboardType to numeric for entering numbers
                                style={{
                                    width: '50%',
                                    fontSize: 16
                                }}
                                name='tup_id'
                                id='tup_id'
                                onChangeText={(text) => setTUPID(text)}
                            />
                        </View>
                    </View>

                    <View style={[styles.container, { marginBottom: 12 }]}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]}
                                source={{ uri: 'https://img.icons8.com/ios/50/online-group-studying.png' }}
                            />
                            {' '}
                            Select Course
                        </Text>
                        <View style={[styles.pickerContainer, { borderColor: 'black', borderWidth: 1, borderRadius: 5, padding: 3 }]}>
                            <Picker
                                selectedValue={course}
                                onValueChange={(itemValue) => setCourse(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Course" value="" />
                                <Picker.Item label="BS in Information Technology" value="BSIT" />
                                <Picker.Item label="BS in Electrical Engineering" value="BSEE" />
                                <Picker.Item label="BS in Electronics Engineering" value="BSECE" />
                                <Picker.Item label="BS in Mechanical Engineering" value="BSME" />
                                <Picker.Item label="BS in Civil Engineering" value="BSCE" />
                                <Picker.Item label="BS in Environmental Science" value="BSESSDP" />
                                <Picker.Item label="BET Major In Automotive Technology" value="BETAT" />
                                <Picker.Item label="BET Major In Chemical Technology" value="BETCHT" />
                                <Picker.Item label="BET Major In Electrical Technology" value="BETET" />
                                <Picker.Item label="BET Major In Electromechanical Technology" value="BETEMT" />
                                <Picker.Item label="BET Major In Electronics Technology" value="BETELXT" />
                                <Picker.Item label="BET Major In Instrumentation and Control Technology" value="BETICT" />
                                <Picker.Item label="BET Major In Mechatronics Technology" value="BETMECT" />
                                <Picker.Item label="BET Major In Dies & Moulds Technology" value="BETDMT" />
                                <Picker.Item label="BET Major In Heating, Ventilation, and Airconditioning/Refrigeration Technology" value="BETHVAC" />
                                <Picker.Item label="BET Major In Non-Destructive Testing Technology" value="BETNDTT" />
                            </Picker>
                        </View>
                    </View>

                    {/* di nagana */}
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]}
                                source={{ uri: 'https://img.icons8.com/ios/50/address--v1.png' }}
                            />
                            {' '} {/* Adding a space here */}
                            Address
                        </Text>
                        <View style={{
                            width: '100%',
                            height: 100, // Adjusted height to 100 for address input field
                            borderColor: 'black', // Changed borderColor to maroon
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Enter your Address'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                keyboardType='default'
                                multiline={true} // Allowing multiline input for address
                                numberOfLines={4} // Set the number of lines to 4 for address
                                style={{
                                    width: '100%',
                                    fontSize: 16
                                }}
                                name='address'
                                id='address'
                                onChangeText={(text) => setAddress(text)}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]}
                                source={{ uri: 'https://img.icons8.com/carbon-copy/100/1-c.png' }}
                            />
                            {' '} {/* Adding a space here */}
                            Mobile Number
                        </Text>

                        <View style={{
                            width: '100%',
                            height: 48,
                            borderColor: 'black', // Changed borderColor to maroon
                            borderWidth: 1,
                            borderRadius: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='+63'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                keyboardType='numeric'
                                style={{
                                    width: '12%',
                                    borderRightWidth: 1,
                                    borderLeftColor: 'black', // Changed borderLeftColor to gray
                                    height: '100%',
                                    fontSize: 16
                                }}
                            />

                            <TextInput
                                placeholder='Enter your phone number'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                keyboardType='numeric'
                                style={{
                                    width: '80%',
                                    fontSize: 16
                                }}
                                name='phone'
                                id='phone'
                                onChangeText={(text) => setPhone(text)}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]}
                                source={{ uri: 'https://img.icons8.com/ios/50/birth-date.png' }}
                            />
                            {' '} {/* Adding a space here */}
                            Birth Date
                        </Text>
                        <TouchableOpacity
                            onPress={showDatePicker}
                            style={{
                                width: '100%',
                                height: 48,
                                borderColor: 'black', // Changed borderColor to maroon
                                borderWidth: 1,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingLeft: 22,
                                marginBottom: 8 // Added marginBottom for spacing
                            }}
                        >
                            <Text style={{ color: 'black', fontSize: 16 }}>
                                {formatDateForDatabase(date)} {/* Display the selected date */}
                            </Text>
                        </TouchableOpacity>
                        {show && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onChange}
                            />
                        )}
                    </View>

                    <View style={[styles.container, { marginBottom: 12 }]}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]}
                                source={{ uri: 'https://img.icons8.com/wired/64/gender.png' }}
                            />
                            {' '}
                            Select Gender
                        </Text>
                        <View style={[styles.pickerContainer, { borderColor: 'black', borderWidth: 1, borderRadius: 5, padding: 3 }]}>
                            <Picker
                                selectedValue={selectedGender}
                                onValueChange={(itemValue) => setSelectedGender(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Gender" value="" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                            </Picker>
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]}
                                source={{ uri: 'https://img.icons8.com/external-outline-agus-raharjo/64/external-email-address-website-ui-outline-agus-raharjo.png' }}
                            />
                            {' '} {/* Adding a space here */}
                            Email Address
                        </Text>
                        <View style={{
                            width: '100%',
                            height: 48,
                            borderColor: 'black', // Changed borderColor to maroon
                            borderWidth: 1,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 22
                        }}>
                            <TextInput
                                placeholder='Enter your Email Address'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                keyboardType='email-address'
                                style={{
                                    width: '100%',
                                    fontSize: 16
                                }}
                                name='email'
                                id='email'
                                onChangeText={(text) => setEmail(text.toLowerCase())}
                            />
                        </View>
                    </View>


                    <View style={{ marginBottom: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            color: 'black' // Changed color to maroon
                        }}>
                            <Image
                                style={[styles.icon, styles.inputIcon, { tintColor: 'black' }]}
                                source={{ uri: 'https://img.icons8.com/ios/50/password--v1.png' }}
                            />
                            {' '} {/* Adding a space here */}
                            Password
                        </Text>
                        <View style={{
                            width: '100%',
                            height: 48,
                            borderColor: 'black', // Changed borderColor to maroon
                            borderWidth: 1,
                            borderRadius: 8,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: 22
                        }}>
                            <TextInput
                                secureTextEntry={!isPasswordShown}
                                placeholder='Enter your password'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                style={{
                                    width: '100%',
                                    fontSize: 16
                                }}
                                name='password'
                                id='password'
                                onChangeText={(text) => setPassword(text)}
                            />
                            <TouchableOpacity
                                onPress={() => setIsPasswordShown(!isPasswordShown)}
                                style={{
                                    position: 'absolute',
                                    right: 12
                                }}
                            >
                                <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color="#808080" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center', // Align items vertically
                        marginVertical: 6
                    }}>
                        <Checkbox
                            style={{ marginRight: 8 }}
                            value={isChecked}
                            onValueChange={setIsChecked}
                            color={isChecked ? 'black' : undefined} // Maroon color when checked
                        />
                        <Text style={{ fontSize: 16 }}>
                            I agree to the terms and conditions
                        </Text>
                    </View>

                    <Modal
                        animationType='slide'
                        transparent={true}
                        visible={isModalVisible}
                        onRequestClose={closeModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>{error}</Text>
                                <TouchableOpacity onPress={closeModal} style={[styles.modalButton, { backgroundColor: 'black' }]}>
                                    <Text style={styles.modalButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Button
                        large
                        primary
                        onPress={() => register()}
                        title="Create Account"
                        filled
                        style={{
                            marginTop: 18,
                            marginBottom: 4,
                            backgroundColor: 'black', // Set the background color to black
                            borderColor: 'black', // Set the border color to black
                        }}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: 'black', // Change the divider color to black
                                marginHorizontal: 10
                            }}
                        />
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', marginHorizontal: 10 }}>
                            Or Sign up with
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: 'black', // Change the divider color to black
                                marginHorizontal: 10
                            }}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                        <TouchableOpacity
                            onPress={() => promptAsync()}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                height: 52,
                                borderWidth: 1,
                                borderColor: 'black', // Changed border color to maroon
                                marginRight: 4,
                                borderRadius: 10,
                                paddingHorizontal: 10, // Added paddingHorizontal for better spacing
                            }}
                        >
                            <Image
                                source={require("../../assets/google.png")}
                                style={{
                                    height: 36,
                                    width: 36,
                                    marginRight: 8
                                }}
                                resizeMode='contain'
                            />
                            <Text style={{ fontSize: 16, color: 'black' }}>Sign in with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginVertical: 22
                    }}>
                        <Text style={{ fontSize: 16, color: 'black' }}>Already have an account?</Text>
                        <Pressable
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: 'black', // Changed color to maroon
                                fontWeight: 'bold',
                                marginLeft: 6
                            }}>Login</Text>
                        </Pressable>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    innerContainer: {
        flex: 1,
        marginHorizontal: 22,
    },
    header: {
        marginVertical: 22,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 12,
        color: COLORS.black,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.black,
    },
    inputContainer: {
        marginBottom: 12,
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: COLORS.maroon,
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
        marginVertical: 8,
    },
    textInputContainer: {
        width: "100%",
        height: 48,
        borderColor: COLORS.maroon,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 22,
    },
    textInput: {
        width: "100%",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalText: {
        marginBottom: 16,
        fontSize: 18,
    },
    modalButton: {
        backgroundColor: COLORS.maroon,
        padding: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        color: COLORS.white,
        textAlign: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.grey,
        marginHorizontal: 10,
    },
    dividerText: {
        fontSize: 14,
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 22,
    },
    loginText: {
        fontSize: 16,
        color: COLORS.black,
    },
    loginLink: {
        fontSize: 16,
        color: COLORS.maroon,
        fontWeight: "bold",
        marginLeft: 6,
    },
});

export default Register;