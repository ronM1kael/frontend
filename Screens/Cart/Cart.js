import React, { useState } from 'react';
import { View, Dimensions, FlatList, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as actions from '../../Context/Actions/cartActions'
import {
    Container,
    Text,
    Box,
    HStack,
    Avatar,
    VStack,
    Spacer,
    Divider,
    Center,
    Button,
    Heading,

} from "native-base";
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from "react-native-vector-icons/FontAwesome";
var { height, width } = Dimensions.get("window");
import EasyButton from "../../Shared/StyledComponents/EasyButton"

const Cart = (props) => {

    const [research_id, setFileId] = useState(false);

    const navigation = useNavigation()
    var total = 0;
    const cartItems = useSelector(state => state.cartItems)
    // console.log(cartItems[0]?.id);
    cartItems.forEach(cart => {
        return (total += cart.price)
    });
    dispatch = useDispatch()
    const renderItem = ({ item, index }) =>
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            _dark={{ bg: 'coolGray.800' }}
            _light={{ bg: 'white' }}
        >
            <Box pl="4" pr="5" py="2" bg="white" keyExtractor={item => item.id}>
                <HStack alignItems="center" space={3}>
                    <Avatar
                        size="48px"
                        source={{
                            uri: item.image ? item.image : 'https://media.idownloadblog.com/wp-content/uploads/2021/10/Red-PDF-app-icon-on-gray-background.png'
                        }}
                    />
                    <VStack>
                        <Text color="coolGray.800" _dark={{ color: 'warmGray.50' }} bold onChangeText={(text) => setResearch_title(text)}>
                            {item.research_title}
                        </Text>
                        {/* Conditional rendering based on a condition */}
                        { /* Check if the condition is met before rendering the text */}
                        {!item.shouldHideId ? null : (
                            <Text color="coolGray.800" _dark={{ color: 'warmGray.50' }} bold onChangeText={(text) => setFileId(text)}>
                                {item.id}
                            </Text>
                        )}
                    </VStack>
                    <Spacer />
                </HStack>
            </Box>
        </TouchableHighlight>


    const renderHiddenItem = (cartItems) =>
        <TouchableOpacity
            onPress={() => dispatch(actions.removeFromCart(cartItems.item))}
        >

            <VStack alignItems="center" style={styles.hiddenButton} >
                <View >
                    <Icon name="trash" color={"white"} size={30} bg="red" />
                    <Text color="white" fontSize="xs" fontWeight="medium">
                        Delete
                    </Text>
                </View>
            </VStack>

        </TouchableOpacity>;

    // console.log(cartItems)

    return (
        <>
            {cartItems.length > 0 ? (
                <Box bg="white" safeArea flex="1" width="100%" >
                    <SwipeListView
                        data={cartItems}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        disableRightSwipe={true}
                        leftOpenValue={75}
                        rightOpenValue={-150}
                        previewOpenValue={-100}
                        previewOpenDelay={3000}
                        closeOnRowBeginSwipe
                    />
                </Box>
            ) : (
                <Box style={styles.emptyContainer}>
                    <Text >No Research Request
                    </Text>
                </Box>
            )}
            <VStack style={styles.bottomContainer} w='100%' justifyContent='space-between'
            >
                <HStack justifyContent="space-between">
                    <EasyButton
                        danger
                        medium
                        alignItems="center"
                        onPress={() => dispatch(actions.clearCart())}
                    >
                        <Text style={{ color: 'white' }}>Clear</Text>
                    </EasyButton>
                    {/* <Button alignItems="center" onPress={() => dispatch(actions.clearCart())} > Clear</Button> */}
                </HStack>
                <HStack justifyContent="space-between">
                    {/* <Button alignItems="center" colorScheme="primary">Check Out</Button> */}
                    <EasyButton
                        secondary
                        medium
                        // onPress={() => navigation.navigate('Details', {research_ids : 22})}
                        onPress={() => navigation.navigate('Checkout', {
                            screen: 'Details',
                            params: {research_id : cartItems[0]?.id}, // Params being passed
                          })}
                    >
                        <Text style={{ color: 'white' }}>Proceed</Text>
                    </EasyButton>
                    {/* <Button alignItems="center" colorScheme="primary" onPress={() => navigation.navigate('Checkout')}>Check Out</Button> */}
                </HStack>
            </VStack >
        </>

    );
}
const styles = StyleSheet.create({
    emptyContainer: {
        height: height,
        alignItems: "center",
        justifyContent: "center",
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white',
        elevation: 20
    },
    price: {
        fontSize: 18,
        margin: 20,
        color: 'red'
    },
    hiddenContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        // width: 'lg'
    },
    hiddenButton: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 25,
        height: 70,
        width: width / 1.2
    }
});

export default Cart
