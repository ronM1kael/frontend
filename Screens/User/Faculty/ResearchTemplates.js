import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, Image, SafeAreaView } from 'react-native';
import baseURL2 from '../../../assets/common/baseurlnew';
import { WebView } from 'react-native-webview';
import Icon from "react-native-vector-icons/FontAwesome";

const ResearchTemplatesScreen = () => {
    const templates = [
        { name: 'Purchase Request', url: `${baseURL2}/uploads/researchTemplates/template1.pdf` },
        { name: 'Research Progress Report', url: `${baseURL2}/uploads/researchTemplates/template2.pdf` },
        { name: 'Profile of Researcher', url: `${baseURL2}/uploads/researchTemplates/template3.pdf` },
        { name: 'Terminal Report Form', url: `${baseURL2}/uploads/researchTemplates/template4.pdf` },
        { name: 'Research Waiver and Warranty', url: `${baseURL2}/uploads/researchTemplates/template5.pdf` },
        { name: 'Standard Research Proposal', url: `${baseURL2}/uploads/researchTemplates/template6.pdf` },
        { name: 'Project Procurement Management Plan', url: `${baseURL2}/uploads/researchTemplates/template7.pdf` },
        { name: 'Waiver Form for Copyright National Library', url: `${baseURL2}/uploads/researchTemplates/template8.pdf` },
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
                    <Text style={{ fontSize: 20 }}>Downloadable Templates Under Research</Text>
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

export default ResearchTemplatesScreen;