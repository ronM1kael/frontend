import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import baseURL, { baseURL2 } from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';

import { useFocusEffect } from '@react-navigation/native';

const PropertyContainer = ({ isLoggedIn }) => {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const context = useContext(AuthGlobal);

    const [posts, setPosts] = useState([]);

    const fetchData = () => {
        fetch(`${baseURL}showannouncements`)
            .then((response) => response.json())
            .then((data) => {
                if (data && data.announcements && Array.isArray(data.announcements)) {
                    setPosts(data.announcements);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    // Integrate useFocusEffect to trigger fetchData when the screen is focused
    useFocusEffect(
        useCallback(() => {
            if (context.stateUser.isAuthenticated === true) {
                fetchData();
            } else {
                fetchData('');
            }
        }, [context.stateUser.isAuthenticated])
    );

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const renderItem = ({ item }) => (
        
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.title}>{item.content}</Text>
                    <Text style={styles.time}>{item.created_at}</Text>
                </View>
            </View>

            <Image
                style={styles.cardImage}
                source={{ uri: `${baseURL2}/images/${item.img_path}` }}
                onError={() => console.log('Error loading image')}
            />

<View style={styles.cardFooter}>
                <View style={styles.socialBarContainer}>
                  <View style={styles.socialBarSection}>
                    <TouchableOpacity style={styles.socialBarButton}>
                      <Image
                        style={styles.icon}
                        source={{ uri: 'https://img.icons8.com/color/70/000000/heart.png' }}
                      />
                      <Text style={styles.socialBarLabel}>78</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.socialBarSection}>
                    <TouchableOpacity style={styles.socialBarButton}>
                      <Image
                        style={styles.icon}
                        source={{ uri: 'https://img.icons8.com/color/70/000000/comments.png' }}
                      />
                      <Text style={styles.socialBarLabel}>25</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.socialBarSection}>
                    <TouchableOpacity style={styles.socialBarButton}>
                      <Image
                        style={styles.icon}
                        source={{
                          uri: 'https://img.icons8.com/color/70/000000/share.png',
                        }}
                      />
                      <Text rkType="primary4 hintColor" style={styles.socialBarLabel}>
                        13
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                </View>
        </View>
    );

    const filteredData = posts.filter((item) =>
        item.content.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={styles.propertyListContainer}
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.announcement_id}_${index}`} // Updated keyExtractor
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    container: {
        flex: 1,
        marginTop: 20,
    },
    list: {
        paddingHorizontal: 17,
        backgroundColor: '#E6E6E6',
    },
    separator: {
        marginTop: 10,
    },
    /******** card **************/
    card: {
        shadowColor: '#00000021',
        shadowOffset: {
            width: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        marginVertical: 8,
        backgroundColor: 'white',
    },
    cardHeader: {
        paddingVertical: 17,
        paddingHorizontal: 16,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1, // Add border for separation
        borderBottomColor: '#CCCCCC', // Border color
    },
    cardContent: {
        paddingVertical: 12.5,
        paddingHorizontal: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12.5,
        paddingBottom: 25,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 1,
        borderBottomRightRadius: 1,
    },
    cardImage: {
        flex: 1,
        height: 150,
        width: null,
    },
    /******** card components **************/
    title: {
        fontSize: 18,
        flex: 1,
    },
    time: {
        fontSize: 13,
        color: '#808080',
        marginTop: 5,
    },
    icon: {
        width: 25,
        height: 25,
    },
    /******** social bar ******************/
    socialBarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    socialBarSection: {
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    socialBarlabel: {
        marginLeft: 8,
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
    socialBarButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PropertyContainer;
