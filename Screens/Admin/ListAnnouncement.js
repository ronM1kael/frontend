import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Modal,
    Image,
    Alert,  // Import Alert for potential error messages
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import axios from 'axios';  // Import Axios for making HTTP requests
import baseURL from "../../assets/common/baseurl";

import Toast from "react-native-toast-message";

import { useNavigation, useFocusEffect } from '@react-navigation/native';

var { width } = Dimensions.get("window");

const ListAnnouncement = ({ item, index, deleteAnnouncement }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    const handleDelete = () => {
        // Call the deleteAnnouncement function passed as a prop
        deleteAnnouncement(item.id); // Use deleteAnnouncement directly
        // You might want to refresh the announcement list or update the UI here
        // For example, trigger a function that refreshes the list of announcements
    };

    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            underlayColor="#E8E8E8"
                            onPress={() => {
                                setModalVisible(false);
                            }}
                            style={{
                                alignSelf: "flex-end",
                                position: "absolute",
                                top: 5,
                                right: 10,
                            }}
                        >
                            <Icon name="close" size={20} />
                        </TouchableOpacity>
                        <EasyButton
                            medium
                            secondary
                            // onPress={() => [navigation.navigate("ProductForm", { item }),
                            // setModalVisible(false)
                            // ]}
                            title="Edit"
                        >
                            <Text style={styles.textStyle}>Edit</Text>
                        </EasyButton>
                        <EasyButton medium danger onPress={handleDelete} title="Delete">
                            <Text style={styles.textStyle}>Delete</Text>
                        </EasyButton>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                onLongPress={() => {
                    setModalVisible(true);
                }}
                style={[
                    styles.container,
                    { backgroundColor: index % 2 === 0 ? "white" : "gainsboro" },
                ]}
            >

                <View style={styles.containers}>
                    <View style={styles.content}>
                        <View style={styles.contentHeader}>
                            <Text style={styles.name}>Title: {item.title}</Text>
                        </View>
                        <Text rkType="primary3 mediumLine">Content: {item.content}</Text>
                    </View>
                </View>

            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    content: {
        marginLeft: 16,
        flex: 1,
    },
    containers: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        backgroundColor: '#eee',
        padding: 8,
        marginTop: 60,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 8,
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    image: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    textContainer: {
        marginLeft: 16,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    phoneText: {
        fontSize: 16,
        color: '#999',
    },
})

export default ListAnnouncement