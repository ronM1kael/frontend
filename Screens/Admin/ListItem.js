import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
  Alert,  
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import axios from 'axios';  
import baseURL from "../../assets/common/baseurl";
import Toast from "react-native-toast-message";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

var { width } = Dimensions.get("window");

const ListItem = ({ item, index, deleteFile }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
  
    const handleDelete = async () => {
      deleteFile(item.id);
    };
  
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
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
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
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
  itemContainer: {
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
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ListItem;