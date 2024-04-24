import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Modal, Pressable, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from '@react-navigation/native';
import baseURL from "../../assets/common/baseurl";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from 'expo-checkbox';
import Button from '../../Components/Button';

const FacultyRegistrationScreen = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        mname: '',
        department: '',
        position: '',
        designation: '',
        tup_id: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        acceptedTerms: false,
    });
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false); // State for modal
    const navigation = useNavigation();

    const [isTextInputDisable, setIsTextInputDisable] = useState(false); // Added state
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await fetch(`${baseURL}mobilefacultyregistration-page`);
            const data = await response.json();
            setDepartments(data.departments);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        // Check if any field is empty
        if (Object.values(formData).some(value => value === '')) {
            setModalVisible(true); // Open modal if any field is empty
            return;
        }
        try {
            const dataToSend = {
                ...formData,
                gender: selectedGender,
                birthdate: formatDateForDatabase(date)
            };

            const res = await axios.post(`${baseURL}mobilefacultyregister`, dataToSend);
            if (res.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Account Successfully Registered.',
                    text2: 'Please wait; Account processing for full verification.'
                  });
                setTimeout(() => {
                    navigation.navigate("Login");
                }, 500);
            }
        } catch (error) {
            showToast("Something went wrong. Please try again.", 'error');
            console.error('Error submitting form:', error);
        }
    };

    const showToast = (message, type) => {
        Toast.show({
            type: type,
            text1: message,
        });
    };

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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
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
                            New Faculty Profile Creation
                        </Text>

                        <Text style={{
                            fontSize: 18,
                            color: '#000',
                            textAlign: 'center'
                        }}>
                            This is pre-registered only to keep others from signing up as faculty member because faculty members have exclusive access to the system; after registering, simply wait for the administrator's clearance to proceed.
                        </Text>
                    </View>
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
                                value={formData.lname}
                                onChangeText={(text) => handleInputChange('lname', text)}
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
                                value={formData.fname}
                                onChangeText={(text) => handleInputChange('fname', text)}
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
                                value={formData.mname}
                                onChangeText={(text) => handleInputChange('mname', text)}
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
                                value={formData.tup_id}
                                onChangeText={(text) => handleInputChange('tup_id', text)}
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
                                source={{ uri: 'https://img.icons8.com/80/organization-chart-people.png' }}
                            />
                            {' '}
                            Select Department
                        </Text>
                        <View style={[styles.pickerContainer, { borderColor: 'black', borderWidth: 1, borderRadius: 5, padding: 3 }]}>
                        <Picker
                        selectedValue={formData.department}
                        style={styles.input}
                        onValueChange={(itemValue, itemIndex) =>
                            handleInputChange('department', itemValue)
                        }>
                        <Picker.Item label="Select Department" value="" />
                        {departments.map((department) => (
                            <Picker.Item
                                key={department.id}
                                label={`${department.department_name} (${department.department_code})`}
                                value={department.id}
                            />
                        ))}
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
                                source={{ uri: 'https://img.icons8.com/wired/64/point-objects--v1.png' }}
                            />
                            {' '} {/* Adding a space here */}
                            Position
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
                                placeholder='Enter your Position'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                keyboardType='default'
                                style={{
                                    width: '100%',
                                    fontSize: 16
                                }}
                                value={formData.position}
                                onChangeText={(text) => handleInputChange('position', text)}
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
                                source={{ uri: 'https://img.icons8.com/external-glyph-geotatah/100/external-designation-estate-planning-glyph-glyph-geotatah.png' }}
                            />
                            {' '} {/* Adding a space here */}
                            Designation
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
                                placeholder='Enter your Designation'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                keyboardType='default'
                                style={{
                                    width: '100%',
                                    fontSize: 16
                                }}
                                value={formData.designation}
                                onChangeText={(text) => handleInputChange('designation', text)}
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
                                value={formData.address}
                                onChangeText={(text) => handleInputChange('address', text)}
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
                                value={formData.phone}
                                onChangeText={(text) => handleInputChange('phone', text)}
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
                            onChange={(event, selectedDate) => onChange(event, selectedDate)} // Pass selectedDate to onChange
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
                                value={formData.email} // Use formData.email instead of state variable directly
                                onChangeText={(text) => handleInputChange('email', text.toLowerCase())} // Handle input change using handleInputChange
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
                                placeholder='Enter your password'
                                placeholderTextColor='black' // Changed placeholderTextColor to black for contrast
                                secureTextEntry={!isPasswordShown}
                                style={{
                                    width: '100%',
                                    fontSize: 16
                                }}
                                value={formData.password}
                                onChangeText={(text) => handleInputChange('password', text)}
                            />
                            <TouchableOpacity
                                onPress={() => setIsPasswordShown(!isPasswordShown)}
                                style={{
                                    position: 'absolute',
                                    right: 12
                                }}
                            >
                                <Ionicons name={isPasswordShown ? 'eye-off' : 'eye'} size={24} color='black' />
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
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Please fill in all fields.</Text>
                                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={[styles.modalButton, { backgroundColor: 'black' }]}>
                                    <Text style={styles.modalButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Button
                        large
                        primary
                        onPress={handleSubmit}
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
        backgroundColor: 'white',
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
        color: 'black',
    },
    subtitle: {
        fontSize: 16,
        color: 'black',
    },
    inputContainer: {
        marginBottom: 12,
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: 'maroon',
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
        marginVertical: 8,
    },
    textInputContainer: {
        width: "100%",
        height: 48,
        borderColor: 'maroon',
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
        backgroundColor: 'maroon',
        padding: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
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
        backgroundColor: 'grey',
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
        color: 'black',
    },
    loginLink: {
        fontSize: 16,
        color: 'maroon',
        fontWeight: "bold",
        marginLeft: 6,
    },
});

export default FacultyRegistrationScreen;
