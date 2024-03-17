import React, { useState, useContext, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, SafeAreaView, ToastAndroid } from 'react-native';
import { loginUser } from '../../Context/Actions/Auth.actions';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import FormContainer from "../../Shared/Form/FormContainer";
import Error from "../../Shared/Error";
import COLORS from '../../Constants/color';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const context = useContext(AuthGlobal);
    const navigation = useNavigation();
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (context.stateUser.isAuthenticated === true) {
                navigation.navigate("UserProfile");
            } else {
                setEmail('');
                setPassword('');
            }
        }, [context.stateUser.isAuthenticated, navigation, setEmail, setPassword])
    );

    const showToast = (message) => {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    };

    const handleSubmit = () => {
        if (email === "" || password === "") {
            setError("Please fill in your credentials");
        } else {
            loginUser(email, password, navigation, context.dispatch)
                .then(() => {
                    // showToast("Login successful");
                    // Navigate to the appropriate screen after successful login
                })
                .catch((error) => {
                    showToast("Login failed. Please check your credentials.");
                    setError("Login failed. Please check your credentials.");
                });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.logoContainer}>
                    <Image
                        source={{
                            uri: 'https://res.cloudinary.com/deda2zopr/image/upload/v1700396494/400103576_1149027812724794_5925367876009301723_n_1_tkrbph.png',
                        }}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.logoText}>R&E-Services</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{ uri: 'https://img.icons8.com/ios-filled/512/circled-envelope.png' }} />
                    <TextInput
                        style={styles.input}
                        keyboardType="email-address"
                        placeholder="Email Address"
                        value={email}
                        onChangeText={(text) => setEmail(text.toLowerCase())}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{ uri: 'https://img.icons8.com/ios-glyphs/512/key.png' }} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={!isPasswordShown}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                    <TouchableOpacity
                        style={styles.togglePasswordVisibility}
                        onPress={() => setIsPasswordShown(!isPasswordShown)}
                    >
                        <Ionicons name={isPasswordShown ? "eye-off" : "eye"} size={24} color="#808080" />
                    </TouchableOpacity>
                </View>

                {/* <TouchableOpacity style={styles.forgotPasswordButton}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity> */}

                {error ? <Error message={error} /> : null}

                <TouchableOpacity style={[styles.loginButton, { backgroundColor: 'black' }]} onPress={() => handleSubmit()}>
                    <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate("Choose")}>
                    <Text style={styles.signupButtonText}>Don't have an account? Sign up</Text>
                </TouchableOpacity>

                {/* Social login buttons */}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    inputIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
    },
    togglePasswordVisibility: {
        position: 'absolute',
        right: 10,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginBottom: 15,
    },
    forgotPasswordText: {
        color: '#808080',
        textDecorationLine: 'underline',
    },
    loginButton: {
        backgroundColor: '#FF5733',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupButton: {
        alignSelf: 'center',
    },
    signupButtonText: {
        color: '#808080',
        textDecorationLine: 'underline',
    },
    // Additional styles for social login buttons, error message, etc.
});

export default Login;
