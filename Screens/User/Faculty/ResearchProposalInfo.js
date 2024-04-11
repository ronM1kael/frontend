import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import baseURL2 from '../../../assets/common/baseurlnew';
import Icon from "react-native-vector-icons/FontAwesome";

const ResearchProposalInfo = () => {

    const templates = [
        { name: 'Standard Research Proposal', url: `${baseURL2}/uploads/researchTemplates/template6.pdf` }
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

    return (
        <View style={styles.container}>
            <Text style={styles.cardTitle}>Submit Research Proposal</Text>
            <View style={styles.hr}></View>
            <View style={styles.notesContainer}>
                <Text style={styles.badge}>Notes:</Text>
                <Text style={styles.notesText}>
                    (To make sure your document is in the proper format, Download this template{' '}
                    <Text style={styles.link} onPress={() => {
                        Viewpdf(templates[0].url);
                    }}>
                        STANDARD RESEARCH PROPOSAL
                    </Text>{' '}
                    and make sure you follow the reference file's content accurately to prevent the proposal from being rejected.)
                </Text>
            </View>

            <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                    <Text style={styles.bold}>Research Program:</Text> consists of two or more multi-disciplinary research projects wherein a Program Leader,
                    assisted by Project Leaders, is assigned to oversee the successful implementation of the research that is expected
                    to be completed within 18 months above.
                </Text>
                <Text style={styles.description}>
                    <Text style={styles.bold}>Research Project:</Text> consists of two or more related or inter-disciplinary studies headed by a Project Leader that is
                    expected to be completed within 12 to 20 months.
                </Text>
                <Text style={styles.description}>
                    <Text style={styles.bold}>Independent Study:</Text> a research study that is expected to be completed within two semesters.
                </Text>
            </View>
            <View style={styles.hr}></View>

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
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    hr: {
        borderBottomColor: 'maroon',
        borderBottomWidth: 5,
        marginBottom: 20,
    },
    notesContainer: {
        marginBottom: 20,
        flexDirection: 'row', // Ensures children are in a row
        alignItems: 'center', // Aligns children vertically
    },
    badge: {
        backgroundColor: 'orange',
        color: '#333',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 10, // Adjusted margin for better spacing
    },
    notesText: {
        color: '#333',
        flex: 1, // Allow text to take remaining space
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    bold: {
        fontWeight: 'bold',
    },
    descriptionContainer: {
        marginBottom: 20,
    },
    description: {
        marginBottom: 10,
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

export default ResearchProposalInfo;
