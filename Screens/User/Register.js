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

    const [userInfo, setUserInfo] = React.useState(null);
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "470890479118-kvvod3c61ml316mbtobs5kk1vcrt6j0s.apps.googleusercontent.com"
    });

    React.useEffect(() => {
        handleSignInWithGoogle();
    }, [response])

    async function handleSignInWithGoogle() {
        const user = await AsyncStorage.getItem("user");
        if (!user) {
            if (response?.type === "success") {
                await getUserInfo(response.authentication.accessToken);
            }
        } else {
            setUserInfo(JSON.parse(user));
        }
    }

    const getUserInfo = async (token) => {
        if (!token) return;
        try {
            const response = await fetch(
                "https:www.googleapis.com/userinfo/v2/me",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const user = await response.json();
            await AsyncStorage.setItem("@user", JSON.stringify(user));
            setUserInfo(user);
        } catch (error) {

        }
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

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

    const register = async () => {

        if (fname === "" || lname === "" || mname === "" || email === "" || password === ""
            || college === "" || course === "" || tup_id === "" || selectedGender === "" || phone === ""
            || address === "" || date === "") {
            setError("Please fill in the form correctly");
            setIsModalVisible(true);
            return;
        }
        else {

            let user = {
                fname: fname,
                lname: lname, // Fill this with the logic for the last name
                mname: mname, // Fill this with the logic for the middle name
                email: email,
                password: password,
                role: "Student", // Assuming "role" is "student" for student registration
                college: college, // Fill this with the logic for the college
                course: course, // Fill this with the logic for the course
                tup_id: tup_id, // Fill this with the logic for the TUP ID
                gender: selectedGender,
                phone: phone,
                address: address, // Fill this with the logic for the address
                birthdate: formatDateForDatabase(date),
            };

            // console.log(user);

            axios
                .post(`${baseURL}students/register`, user)
                .then((res) => {
                    console.log(res);
                    if (res.status === 200) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "Registration Succeeded",
                            text2: "Please Login into your account",
                        });
                        setTimeout(() => {
                            navigation.navigate("Login");
                        }, 500);
                    }
                })
                .catch((error) => {
                    Toast.show({
                        position: 'bottom',
                        bottomOffset: 20,
                        type: "error",
                        text1: "Something went wrong",
                        text2: "Please try again",
                    });
                    // console.log(error.response.headers);
                });

        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
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
                            Create a New Student Profile
                        </Text>

                        <Text style={{
                            fontSize: 16,
                            color: COLORS.black
                        }}>Note: All students must be enrolled in Technological University of The Philppines - Taguig Campus. Please enter the Student ID number.</Text>
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
                                placeholder='Enter your Last Name'
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"lname"}
                                id={"lname"}
                                onChangeText={(text) => setLName(text)}
                            />
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
                                placeholder='Enter your First Name'
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"fname"}
                                id={"fname"}
                                onChangeText={(text) => setFName(text)}
                            />
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
                                placeholder='Enter your Middle Name'
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"mname"}
                                id={"mname"}
                                onChangeText={(text) => setMName(text)}
                            />
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
                                placeholder='Enter your Student ID'
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "50%"
                                }}
                                name={"tup_id"}
                                id={"tup_id"}
                                onChangeText={(text) => setTUPID(text)}
                            />
                        </View>
                    </View>

                    {/* di pa nagana */}
                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/ios/50/book-stack.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>College</Text>

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
                                placeholder='Enter your College'
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"college"}
                                id={"college"}
                                onChangeText={(text) => setCollege(text)}
                            />
                        </View>
                    </View>

                    {/* DI PA NAGANA */}
                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/ios/50/online-group-studying.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Course</Text>

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
                                placeholder='Enter your Course'
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"course"}
                                id={"course"}
                                onChangeText={(text) => setCourse(text)}
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
                                placeholder='Enter your Address'
                                placeholderTextColor={COLORS.black}
                                keyboardType='text'
                                style={{
                                    width: "100%"
                                }}
                                name={"address"}
                                id={"address"}
                                onChangeText={(text) => setAddress(text)}
                            />
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
                                placeholder='Enter your phone number'
                                placeholderTextColor={COLORS.black}
                                name={"phone"}
                                id={"phone"}
                                keyboardType='numeric'
                                onChangeText={(text) => setPhone(text)}
                                style={{
                                    width: "80%"
                                }}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={{
                                width: 50,
                                height: 50,
                                tintColor: 'maroon',
                            }}
                            source={{ uri: 'https://img.icons8.com/ios/50/birth-date.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '400',
                            marginVertical: 8
                        }}>Birth Date</Text>

                        <TouchableOpacity
                            onPress={showDatePicker}
                            style={{
                                width: '100%',
                                height: 48,
                                borderColor: '#800000',
                                borderWidth: 1,
                                borderRadius: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingLeft: 22,
                            }}
                        >
                            <Text style={{ color: '#000000' }}>
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

                    <View style={styles.container}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/wired/64/gender.png' }}
                        />
                        <Text style={styles.label}>Select Gender</Text>

                        <View style={[styles.pickerContainer, { borderColor: 'maroon', borderWidth: 1, borderRadius: 5, padding: 3 }]}>
                            <Picker
                                selectedValue={selectedGender}
                                onValueChange={(itemValue) => setSelectedGender(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Gender" value="" />
                                <Picker.Item label="Male" value="male" />
                                <Picker.Item label="Female" value="female" />
                            </Picker>
                        </View>
                    </View>


                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/external-outline-agus-raharjo/64/external-email-address-website-ui-outline-agus-raharjo.png' }}
                        />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Email address</Text>

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
                                placeholder='Enter your Email Address'
                                placeholderTextColor={COLORS.black}
                                keyboardType='email-address'
                                style={{
                                    width: "100%"
                                }}
                                name={"email"}
                                id={"email"}
                                onChangeText={(text) => setEmail(text.toLowerCase())}
                            />
                        </View>
                    </View>

                    <View style={{ marginBottom: 12 }}>
                        <Image
                            style={[styles.icon, styles.inputIcon, { tintColor: 'maroon' }]}
                            source={{ uri: 'https://img.icons8.com/ios/50/password--v1.png' }}
                        />

                        <Text style={{
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}>Password</Text>


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
                                placeholder='Enter your password'
                                placeholderTextColor={COLORS.black}
                                secureTextEntry={!isPasswordShown}
                                style={{
                                    width: "100%"
                                }}
                                name={"password"}
                                id={"password"}
                                onChangeText={(text) => setPassword(text)}
                            />

                            <TouchableOpacity
                                onPress={() => setIsPasswordShown(!isPasswordShown)}
                                style={{
                                    position: "absolute",
                                    right: 12
                                }}
                            >
                                {
                                    isPasswordShown == false ? (
                                        <Ionicons name="eye-off" size={24} color='#800000' />
                                    ) : (
                                        <Ionicons name="eye" size={24} color='#800000' />
                                    )
                                }

                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        marginVertical: 6
                    }}>
                        <Checkbox
                            style={{ marginRight: 8 }}
                            value={isChecked}
                            onValueChange={setIsChecked}
                            color={isChecked ? '#800000' : undefined} // Maroon color when checked
                        />

                        <Text>I agree to the terms and conditions</Text>
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
                                <TouchableOpacity onPress={closeModal} style={[styles.modalButton, { backgroundColor: 'maroon' }]}>
                                    <Text style={styles.modalButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Button
                        large primary onPress={() => register()}
                        title="Create Account"
                        filled
                        style={{
                            marginTop: 18,
                            marginBottom: 4,
                        }}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: COLORS.grey,
                                marginHorizontal: 10
                            }}
                        />
                        <Text style={{ fontSize: 14 }}>Or Sign up with</Text>
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: COLORS.grey,
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
                                borderColor: '#800000', // Maroon border color
                                marginRight: 4,
                                borderRadius: 10
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

                            <Text>Sign in with Google</Text>
                        </TouchableOpacity>
                    </View>


                    <View style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginVertical: 22
                    }}>
                        <Text style={{ fontSize: 16, color: COLORS.black }}>Already have an account</Text>
                        <Pressable
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: '#800000', // Maroon color
                                fontWeight: "bold",
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

export default Register;