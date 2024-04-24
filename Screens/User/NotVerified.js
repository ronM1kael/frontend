import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from '../../Context/Store/AuthGlobal';
import Icon from "react-native-vector-icons/FontAwesome";
import { logoutUser } from "../../Context/Actions/Auth.actions";

const AccountConfirmationMessage = () => {

    const context = useContext(AuthGlobal);

    const navigation = useNavigation();

    const handleLogout = async () => {
        logoutUser(context.dispatch, navigation);
    };

    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                <Text style={styles.messageText}>
                    Your account has not yet been fully confirmed; please wait for the administrator's process to complete.
                </Text>
            </View>
            
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Icon name="sign-out" size={24} color={'#fff'} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#ecf0f1', // Background color
    },
    messageContainer: {
        padding: 20,
        backgroundColor: '#fff', // Message container background color
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc', // Border color
        maxWidth: '80%', // Limit the width of the message container
        marginBottom: 20,
    },
    messageText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#333', // Text color
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e74c3c', // Button background color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});

export default AccountConfirmationMessage;