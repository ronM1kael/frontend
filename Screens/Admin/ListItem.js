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

const ListItem = ({ item, index, deleteFile }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
  
    const handleDelete = async () => {
      deleteFile(item.id);
      // try {
      //   await axios.delete(`${baseURL}delete_file/${item.id}`);
      //   setModalVisible(false);
      //   Toast.show({
      //     type: "success",
      //     text1: "File deleted successfully",
      //     text2: "",
      //   });
      // } catch (error) {
      //   console.error("Error deleting file:", error);
      //   Toast.show({
      //     type: "error",
      //     text1: "Error deleting file",
      //     text2: "Please try again.",
      //   });
      // }
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
              <EasyButton medium danger onPress={() => handleDelete()} title="Delete">
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
          <View style={styles.itemContainer}>
            <Image style={styles.image} source={{
              uri:
                'https://media.idownloadblog.com/wp-content/uploads/2021/10/Red-PDF-app-icon-on-gray-background.png',
            }} />
            <View style={styles.textContainer}>
            <Text style={styles.nameText}>{item.research_title}</Text>
          </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  

  const styles = StyleSheet.create({
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

export default ListItem