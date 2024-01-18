import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from "react-native-swiper";

var { width } = Dimensions.get("window");

const Banner = () => {
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    setBannerData([
      "https://t3.ftcdn.net/jpg/03/13/59/86/360_F_313598699_jyO0OFvaccHWe9YsAY1s8Ycpf0qVPIVz.jpg",
      "https://static.vecteezy.com/system/resources/previews/003/313/595/non_2x/attention-please-concept-of-important-announcement-free-vector.jpg",
      "https://media.istockphoto.com/id/1250483402/vector/important-announcement-speech-bubble-icon-vector-design.jpg?s=612x612&w=0&k=20&c=MSqRVE08RxLlcJaC6aP6ksT0HqHzUGM3Ieyu38hRTIU=",
    ]);

    return () => {
      setBannerData([]);
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper
            style={{ height: width / 2 }}
            showButtons={false}
            autoplay={true}
            autoplayTimeout={2}
          >
            {bannerData.map((item) => {
              return (
                <Image
                  key={item}
                  style={styles.imageBanner}
                  resizeMode="contain"
                  source={{ uri: item }}
                />
              );
            })}
          </Swiper>
          <View style={{ height: 20 }}></View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gainsboro",
  },
  swiper: {
    width: width,
    alignItems: "center",
    marginTop: 10,
  },
  imageBanner: {
    height: width / 2,
    width: width - 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
});

export default Banner;
