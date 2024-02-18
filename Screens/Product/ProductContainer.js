import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Banner from '../../Shared/Banner';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';

import { useFocusEffect } from '@react-navigation/native';

import { addToCartAction } from '../../Context/Actions/cartActions';

import { WebView } from 'react-native-webview';
import baseURL2 from '../../assets/common/baseurlnew';

const PropertyContainer = ({ isLoggedIn }) => {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [showPDF, setShowPDF] = useState(false);
  const [pdfFileName, setPdfFileName] = useState('');
  const context = useContext(AuthGlobal);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cartItems);

  const addToCart = (selectedFile) => {
    dispatch(addToCartAction(selectedFile)); // Dispatch action to add file to cart
  };

  const isInCart = (itemId) => {
    return cartItems.some((cartItem) => cartItem.id === itemId);
  };

  const isCartEmpty = cartItems.length === 0;

  const handlePress = (itemId) => {
    if (!isCartEmpty) {
      return;
    }
    addToCart(itemId);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwt');
      const userProfile = context.stateUser.userProfile;

      if (!jwtToken || !context.stateUser.isAuthenticated || !userProfile || !userProfile.id) {
        console.error('Invalid authentication state');
        return;
      }

      const response = await fetch(`${baseURL}myfiles/${userProfile.id}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      const result = await response.json();
      console.log('Fetched Data:', result);
      setData(result.myfiles);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const Viewpdf = async (fileName) => {
    try {
      const response = await fetch(`${baseURL}mobileshowpdf/${fileName}`);
      const data = await response.json();
      const base64Content = data.base64Content;
      const uri = `${baseURL2}/uploads/pdf/${fileName}`;
      setPdfFileName(uri);
      setShowPDF(true);
      console.log(uri);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const handleClosePDF = () => {
    setShowPDF(false);
    setPdfFileName('');
  };

  const renderItem = ({ item }) => (
    <>
      <TouchableOpacity
        onPress={() => {
          Viewpdf(item.research_file); // Assuming each item has a fileName property
        }}
      >
        <View style={styles.card}>
          <Image
            source={{
              uri: 'https://media.idownloadblog.com/wp-content/uploads/2021/10/Red-PDF-app-icon-on-gray-background.png',
            }}
            style={styles.image}
          />
          <View style={styles.cardBody}>
            <Text style={styles.price}>{item.research_title}</Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.footerContent}></View>
            <TouchableOpacity
              style={[
                styles.addButton,
                isCartEmpty ? null : styles.disabledButton,
              ]}
              onPress={() => handlePress(item)}
              disabled={!isCartEmpty}
            >
              <Text style={styles.buttonText}>
                {isCartEmpty ? (isInCart(item.id) ? 'Added to Cart' : 'Add Request') : 'One request at a time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );

  const filteredData = data.filter((item) => {
    return (
      item.research_title &&
      item.research_title.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <>
      <View style={{ height: 250 }}>
        <Banner />
      </View>
      {context.stateUser.isAuthenticated ? (
        <View style={styles.container}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search properties..."
              onChangeText={handleSearch}
              value={searchText}
            />
          </View>
          <FlatList
            contentContainerStyle={styles.propertyListContainer}
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <Modal visible={showPDF} transparent={false}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={handleClosePDF}>
                <Text>Close PDF</Text>
              </TouchableOpacity>
              <WebView source={{ uri: pdfFileName }} />
            </View>
          </Modal>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    backgroundColor: 'grey',
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  searchInputContainer: {
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  propertyListContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  image: {
    height: 150,
    marginBottom: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cardBody: {
    marginBottom: 10,
    padding: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  cardFooter: {
    padding: 10,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: 'maroon',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PropertyContainer;
