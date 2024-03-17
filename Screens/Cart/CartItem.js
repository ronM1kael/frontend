import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Box, HStack, Avatar } from 'native-base';

const CartItem = (props) => {
  const data = props.item.item;

  return (
    <Box style={styles.listItem}>
      <HStack width="100%" px={4}>
        <HStack space={2} alignItems="center">
          <Avatar
            color="white"
            bg={'secondary.700'}
            size="48px"
            source={{
              uri: data.product.image
                ? data.product.image
                : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png',
            }}
          />
          <Text>{data.product.name}</Text>
          <Text>$ {data.product.price}</Text>
        </HStack>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  listItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});

export default CartItem;