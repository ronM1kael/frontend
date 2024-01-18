import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'

import { useNavigation } from '@react-navigation/native';

export default HomeMenuView = () => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menuBox}>
                <Image
                    style={styles.icon}
                    source={{ uri: 'https://res.cloudinary.com/deda2zopr/image/upload/v1701494522/image-removebg-preview_dmxdgp.png' }}
                />
                <Text style={styles.info}>Request</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBox}
                              onPress={() => navigation.navigate("AnnouncementForm")}>
                <Image
                    style={styles.icon}
                    source={{ uri: 'https://res.cloudinary.com/deda2zopr/image/upload/v1701496530/image-removebg-preview_1_bb57zz.png' }}
                />
                {/* <Text style={styles.info}>Annoucenements</Text> */}
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBox}>
                <Image
                    style={styles.icon}
                    source={{ uri: 'https://img.icons8.com/color/70/000000/pie-chart.png' }}
                />
                <Text style={styles.info}
                onPress={() => navigation.navigate("UserChart")}>U Charts</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBox}>
                <Image
                    style={styles.icon}
                    source={{ uri: 'https://img.icons8.com/color/70/000000/pie-chart.png' }}
                />
                <Text style={styles.info}
                onPress={() => navigation.navigate("RequestChart")}>R Charts</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.menuBox}>
                <Image
                    style={styles.icon}
                    source={{ uri: 'https://img.icons8.com/color/70/000000/product.png' }}
                />
                <Text style={styles.info}>Product</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBox}>
                <Image
                    style={styles.icon}
                    source={{ uri: 'https://img.icons8.com/color/70/000000/traffic-jam.png' }}
                />
                <Text style={styles.info}>Order</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBox}>
                <Image
                    style={styles.icon}
                    source={{ uri: 'https://img.icons8.com/dusk/70/000000/visual-game-boy.png' }}
                />
                <Text style={styles.info}>Info</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBox}>
                <Image
                    style={styles.icon}
                    source={{ uri: 'https://img.icons8.com/color/70/000000/user.png' }}
                />
                <Text style={styles.info}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBox}>
                <Image
                    style={styles.icon}
                    source={{ uri: 'https://img.icons8.com/color/70/000000/family.png' }}
                />
                <Text style={styles.info}>Friends</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // Added this line to horizontally center the content
    },
    menuBox: {
        backgroundColor: 'white', // Changing the background color to white
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 12,
        borderWidth: 2, // Adding border width
        borderColor: 'maroon', // Setting the border color to maroon
        borderRadius: 8, // Adding border radius for a rounded look
    },
    icon: {
        width: 60,
        height: 60,
    },
    info: {
        fontSize: 22,
        color: 'maroon', // Changing the text color to maroon
    },
})
