import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Image, SafeAreaView } from 'react-native';
import baseURL2 from '../../../assets/common/baseurlnew';
import { WebView } from 'react-native-webview';
import Icon from "react-native-vector-icons/FontAwesome";

const ExtensionTemplatesScreen = () => {
    const templates = [
        { name: 'Detailed Extension Project Proposals', url: `${baseURL2}/uploads/extensionTemplates/template1.pdf` },
        { name: 'Submission of Extension Project Proposal', url: `${baseURL2}/uploads/extensionTemplates/template2.pdf` },
        { name: 'Implementation of UREC-Approved Extension Projects', url: `${baseURL2}/uploads/extensionTemplates/template3.pdf` },
        { name: 'Post Implementation of Extension Projects', url: `${baseURL2}/uploads/extensionTemplates/template4.pdf` },
        { name: 'Conduct of Training Program', url: `${baseURL2}/uploads/extensionTemplates/template5.pdf` },
        { name: 'Monitoring and Evaluation Form for Extension Projects', url: `${baseURL2}/uploads/extensionTemplates/template6.pdf` },
        { name: 'Post Evaluation Form for Short-Tem Extension Projects & Activities', url: `${baseURL2}/uploads/extensionTemplates/template7.pdf` },
        { name: 'Detailed Extension Project Proposals', url: `${baseURL2}/uploads/extensionTemplates/template8.pdf` },
        { name: 'List of Participants', url: `${baseURL2}/uploads/extensionTemplates/template9.pdf` },
        { name: 'Requisition and Issue Slip', url: `${baseURL2}/uploads/extensionTemplates/template10.pdf` },
        { name: 'Liquidation Report', url: `${baseURL2}/uploads/extensionTemplates/template11.pdf` },
        { name: 'Project Implementation Matrixs', url: `${baseURL2}/uploads/extensionTemplates/template12.pdf` },
        { name: 'Client/Partner Consultancy & Advisory Satisfaction Feedback Form', url: `${baseURL2}/uploads/extensionTemplates/template13.pdf` },
        { name: 'Option Agreement', url: `${baseURL2}/uploads/extensionTemplates/template14.pdf` },
        { name: 'Institutional/International Linkages & External Affairs Office', url: `${baseURL2}/uploads/extensionTemplates/template15.pdf` },
        { name: 'Request to Conduct Needs Assessment', url: `${baseURL2}/uploads/extensionTemplates/template16.pdf` },
    ];

    const [pdfFileName, setPdfFileName] = useState('');
    const [showPDF, setShowPDF] = useState(false);

    const handleClosePDF = () => {
        setShowPDF(false);
        setPdfFileName('');
    };

    const Viewpdf = (url) => {
        setPdfFileName(url);
        setShowPDF(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => {
                Viewpdf(item.url);
            }}
        >
            <View style={styles.cardContent}>
                <Text style={styles.description}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Text style={styles.download}>Download </Text>
                    <Icon name="download" size={20} color="maroon" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <Text style={{ fontSize: 20 }}>Downloadable Templates Under Extension</Text>
                </View>
                <FlatList
                    data={templates}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />

                <Modal
                    visible={showPDF}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleClosePDF}
                >
                    <View style={styles.centeredViews}>
                        <View style={[styles.modalViews, { height: 200, justifyContent: 'center', alignItems: 'center' }]}>
                            <TouchableOpacity onPress={handleClosePDF} style={styles.closeButtons}>
                                <Icon name="close" size={20} />
                            </TouchableOpacity>
                            <WebView source={{ uri: pdfFileName }} />
                            <View style={{ alignItems: 'center' }}>
                                <Icon name="check-circle" size={100} color="green" />
                                <Text style={[styles.successTexts, { marginLeft: 10 }]}>The file has been successfully downloaded.</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,

        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'flex-start', // Align content to the left
    },
    description: {
        fontSize: 18,
        color: '#008080',
        fontWeight: 'bold',
    },
    download: {
        color: 'maroon',
    },
    centeredViews: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalViews: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    closeButtons: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    successTexts: {
        marginTop: 10,
        fontSize: 16,
        color: 'green',
    },
});

export default ExtensionTemplatesScreen;
