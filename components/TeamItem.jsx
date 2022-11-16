import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  Platform,
  View,
} from "react-native";
import React from "react";
import { Avatars } from "../utils/avatars";

const CARD_HEIGHT = 90;
const CARD_WIDTH = 310;

export const TeamItem = ({ player }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={Avatars[player.avatarPath + 1]}
          style={styles.cardAvatar}
        />
        <Text style={styles.cardText}>{player.name}</Text>
        <ImageBackground
          style={styles.cardBackground}
          resizeMode='cover'
          source={require("../assets/home_background.jpg")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    marginVertical: 10,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 5,
    flexDirection: "row",
    backgroundColor: "rgba(20,20,20,1)",
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    // Shadow for Android
    elevation: 5,
  },
  cardBackground: {
    height: CARD_HEIGHT,
    zIndex: -1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardAvatar: {
    width: 89,
    height: 89,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  cardText: {
    marginTop: Platform.OS == "ios" ? CARD_HEIGHT / 2 - 12 : 0,
    maxWidth: 200,
    color: "white",
    fontFamily: "Countach",
    fontSize: 30,
    textAlignVertical: "center",
    textAlign: "center",
    marginLeft: 10,
    textTransform: "uppercase",
  },
});
