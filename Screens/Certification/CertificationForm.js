import React, { useState, useEffect } from "react"
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Platform,
    TextInput
} from "react-native"
// import { Item, Picker, Select, Box } from "native-base"
import FormContainer from "../../Shared/Form/FormContainer"
import Input from "../../Shared/Form/Input"
import EasyButton from "../../Shared/StyledComponents/EasyButton"

import Icon from "react-native-vector-icons/FontAwesome"
import Toast from "react-native-toast-message"
import AsyncStorage from '@react-native-async-storage/async-storage'
import baseURL from "../../assets/common/baseurl"
import Error from "../../Shared/Error"
import axios from "axios"
import * as ImagePicker from "expo-image-picker"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import mime from "mime";

import { RadioButton } from 'react-native-paper'; // Import RadioButton from a UI library
import { Select, Box } from 'native-base';

import Checkbox from 'expo-checkbox';

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const CertificationForm = (props) => {
    // console.log(props.route.params)
   

    const [pickerValue, setPickerValue] = useState('');
    const [brand, setBrand] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [mainImage, setMainImage] = useState();
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [token, setToken] = useState();
    const [error, setError] = useState();
    const [countInStock, setCountInStock] = useState();
    const [rating, setRating] = useState(0);
    const [isFeatured, setIsFeatured] = useState(false);
    const [richDescription, setRichDescription] = useState();
    const [numReviews, setNumReviews] = useState(0);
    const [item, setItem] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    const [isChecked, setIsChecked] = useState(false);

    let navigation = useNavigation()

    useEffect(() => {
        if (!props.route.params) {
            setItem(null);
        } else {
            setItem(props.route.params.item);
            setBrand(props.route.params.item.brand);
            setName(props.route.params.item.name);
            setPrice(props.route.params.item.price.toString());
            setDescription(props.route.params.item.description);
            setMainImage(props.route.params.item.image);
            setImage(props.route.params.item.image);
            setCategory(props.route.params.item.category._id);
            setPickerValue(props.route.params.item.category._id);
            setCountInStock(props.route.params.item.countInStock.toString());
        }
        AsyncStorage.getItem("jwt")
            .then((res) => {
                setToken(res)
            })
            .catch((error) => console.log(error))
        axios
            .get(`${baseURL}categories`)
            .then((res) => setCategories(res.data))
            .catch((error) => alert("Error to load categories"));
        (async () => {
            if (Platform.OS !== "web") {
                const {
                    status,
                } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") {
                    alert("Sorry, we need camera roll permissions to make this work!")
                }
            }
        })();
        return () => {
            setCategories([])
        }
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.canceled) {
            console.log(result.assets)
            setMainImage(result.assets[0].uri);
            setImage(result.assets[0].uri);
        }
    }
    

    const addProduct = () => {
        if (
            name == "" ||
            brand == "" ||
            price == "" ||
            description == "" ||
            category == "" ||
            countInStock == ""
        ) {
            setError("Please fill in the form correctly")
        }

        let formData = new FormData();
        const newImageUri = "file:///" + image.split("file:/").join("");

        formData.append("name", name);
        formData.append("brand", brand);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("countInStock", countInStock);
        formData.append("richDescription", richDescription);
        formData.append("rating", rating);
        formData.append("numReviews", numReviews);
        formData.append("isFeatured", isFeatured);
        formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop()
        });

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            }
        }
        if (item !== null) {
            console.log(item)
            axios
                .put(`${baseURL}products/${item.id}`, formData, config)
                .then((res) => {
                    if (res.status == 200 || res.status == 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "Product successfuly updated",
                            text2: ""
                        });
                        setTimeout(() => {
                            navigation.navigate("Products");
                        }, 500)
                    }
                })
                .catch((error) => {
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "Something went wrong",
                        text2: "Please try again"
                    })
                })
        } else {
            axios
                .post(`${baseURL}products`, formData, config)
                .then((res) => {
                    if (res.status == 200 || res.status == 201) {
                        Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "New Product added",
                            text2: ""
                        });
                        setTimeout(() => {
                            navigation.navigate("Products");
                        }, 500)
                    }
                })
                .catch((error) => {
                    console.log(error)
                    Toast.show({
                        topOffset: 60,
                        type: "error",
                        text1: "Something went wrong",
                        text2: "Please try again"
                    })
                })

        }

    }
    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <View style={styles.container}>

                <Image
                    source={{uri: 'https://www.bootdey.com/image/280x280/800000/800000'}}
                    style={styles.background}
                />

                <View style={styles.formContainer}>

                <Text style={styles.title}>Requesting For Certification</Text>

                <View style={styles.card}>

                <View style={styles.inputContainer}>

                        <Text style={styles.label}>
                            Is there an initial run of a similarity test (Turnitin) by your research adviser?
                        </Text>
                </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Yes</Text>
                        <RadioButton
                            value="yes"
                            status={!showDropdown ? 'checked' : 'unchecked'}
                            onPress={() => setShowDropdown(false)}
                        />
                        <Text>No</Text>
                        <RadioButton
                            value="no"
                            status={showDropdown ? 'checked' : 'unchecked'}
                            onPress={() => setShowDropdown(true)}
                        />
                    </View>

                    {showDropdown && (
                        <Box style={{ borderColor: 'maroon', borderWidth: 1, borderRadius: 5, padding: 3 }}>
                            <Select
                                minWidth="90%"
                                placeholder="Select Frequency Submission"
                                placeholderTextColor="#999"
                                selectedValue={selectedSubmission}
                                onValueChange={(value) => setSelectedSubmission(value)}
                            >
                                <Select.Item label="2nd Submission" value={2} />
                                <Select.Item label="3rd Submission" value={3} />
                                <Select.Item label="4th Submission" value={4} />
                                <Select.Item label="5th Submission" value={5} />
                            </Select>
                        </Box>
                    )}

                    {showDropdown && selectedSubmission && (
                        // Render content based on the selected submission, e.g., additional fields or components
                        <View>
                            {/* Add your additional content here */}
                        </View>
                    )}
                
                


            <View style={styles.inputContainer}>
                
                    <Text style={styles.label}>
                    Type of Thesis
                    </Text>

                <Box style={{ borderColor: 'maroon', borderWidth: 1, borderRadius: 5, padding: 3 }} >
                    <Select
                    minWidth="90%"
                    placeholder="Select Type of Thesis"
                    selectedValue={selectedSubmission}
                    onValueChange={(value) => setSelectedSubmission(value)}
                    >
                    <Select.Item label="2nd Submission" value={2} />
                    <Select.Item label="3rd Submission" value={3} />
                    <Select.Item label="4th Submission" value={4} />
                    <Select.Item label="5th Submission" value={5} />
                    </Select>
                </Box>

                {selectedSubmission && (
                    // Render content based on the selected submission, e.g., additional fields or components
                    <View>
                    {/* Add your additional content here */}
                    </View>
                )}
            </View>

            <View style={styles.inputContainer}>
                
                    <Text style={styles.label}>
                    Requestor Type
                    </Text>

                <Box style={{ borderColor: 'maroon', borderWidth: 1, borderRadius: 5, padding: 3 }} >
                    <Select
                    minWidth="90%"
                    placeholder="Select Requestor Type"
                    selectedValue={selectedSubmission}
                    onValueChange={(value) => setSelectedSubmission(value)}
                    >
                    <Select.Item label="2nd Submission" value={2} />
                    <Select.Item label="3rd Submission" value={3} />
                    <Select.Item label="4th Submission" value={4} />
                    <Select.Item label="5th Submission" value={5} />
                    </Select>
                </Box>

                {selectedSubmission && (
                    // Render content based on the selected submission, e.g., additional fields or components
                    <View>
                    {/* Add your additional content here */}
                    </View>
                )}
            </View>


            <View style={styles.inputContainer}>
            <Text style={styles.label}>Research Title</Text>
            <View style={{
                        width: "100%",
                        height: 100,
                        borderColor: '#800000',
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
            <TextInput
              placeholder="Input Research Title"
              placeholderTextColor="#999"
              style={{
                width: "105%"
            }}
            />
            </View>
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Researcher Name 1</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Researcher Name 1"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Researcher Name 2</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Researcher Name 2"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Researcher Name 3</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Researcher Name 3"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Researcher Name 4</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Researcher Name 4"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Researcher Name 5</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Researcher Name 1"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Researcher Name 6</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Researcher Name 6"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Researcher Name 7</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Researcher Name 7"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Researcher Name 8</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Researcher Name 8"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Purpose</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Purpose"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>(Research Specialist) Who initially processed your paper</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Research Specialist"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Research Staff Incharge</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Research Staff Incharge"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Name of Adviser</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Name of Adviser"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Adviser Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Adviser Email"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>College</Text>
            <TextInput
              style={styles.input}
              placeholder="Input College"
              placeholderTextColor="#999"
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.label}>Course</Text>
            <TextInput
              style={styles.input}
              placeholder="Input Course"
              placeholderTextColor="#999"
            />
            </View>

            <View style={{
                    flexDirection: 'row',
                    marginVertical: 6
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? '#800000' : undefined} // Maroon color when checked
                    />

                    <Text>I agree to the terms and conditions</Text>
            </View>     

            {error ? <Error message={error} /> : null}

            <TouchableOpacity style={styles.button}>
                
                <Text style={styles.buttonText}>Confirm</Text>
                
            </TouchableOpacity>
                
                </View>

                </View>

            </View>
        </KeyboardAwareScrollView>
    )
}


const styles = {
    container: {
      flex: 1,
    },
    background: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: 120,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius:60,
      resizeMode: 'contain',
    },
  
      formContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 20,
        marginTop: 20,
      },
      card: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        padding: 20,
        marginBottom: 20,
      },
      inputContainer: {
        marginBottom: 20,
      },
      label: {
        fontSize: 16,
        color: '#333',
      },
      input: {
        height: 40,
        borderRadius:6,
        borderWidth: 1,
        borderColor: 'maroon',
        color: '#333',
        paddingLeft:10,
      },
      button: {
        width: '100%',
        height: 40,
        backgroundColor: 'maroon',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
      },
    };


export default CertificationForm;