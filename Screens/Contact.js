import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

const ContactUs = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.main}>
                <View style={styles.pageTitle}>
                    <Text style={styles.pageTitleText}>Contact Us</Text>
                </View>

                <View style={styles.contactSection}>
                    <View style={styles.row}>
                        <View style={styles.col}>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoIcon}>📍</Text>
                                <Text style={styles.infoText}>Address</Text>
                                <Text>A108 Adam Street,{`\n`}New York, NY 535022</Text>
                            </View>
                        </View>
                        <View style={styles.col}>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoIcon}>📞</Text>
                                <Text style={styles.infoText}>Call Us</Text>
                                <Text>+1 5589 55488 55{`\n`}+1 6678 254445 41</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoIcon}>✉️</Text>
                                <Text style={styles.infoText}>Email Us</Text>
                                <Text>info@example.com{`\n`}contact@example.com</Text>
                            </View>
                        </View>
                        <View style={styles.col}>
                            <View style={styles.infoBox}>
                                <Text style={styles.infoIcon}>⏰</Text>
                                <Text style={styles.infoText}>Open Hours</Text>
                                <Text>Monday - Friday{`\n`}9:00AM - 05:00PM</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.col}>
                    <View style={styles.card}>
                        <TextInput style={styles.input} placeholder="Your Name" />
                        <TextInput style={styles.input} placeholder="Your Email" />
                        <TextInput style={styles.input} placeholder="Subject" />
                        <TextInput style={styles.input} placeholder="Message" multiline numberOfLines={6} />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => alert('Your message has been sent. Thank you!')}>
                                <Text style={styles.buttonText}>Send Message</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    pageTitle: {
        alignItems: 'center',
        marginVertical: 22,
    },
    pageTitleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
    },
    contactSection: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    col: {
        flex: 1,
    },
    infoBox: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    infoIcon: {
        fontSize: 30,
    },
    infoText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: 'maroon',
        marginBottom: 10,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'maroon',
        borderRadius: 5,
        padding: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ContactUs;
