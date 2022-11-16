import { View, Text, Image, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import React from "react";

const warzone_number = require("../assets/warzone_numbers.jpg");

export const Title = () => {
  const [loaded] = useFonts({
    Countach: require("../assets/fonts/Countach.otf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.textWrapper}>
      <Text style={styles.text}>TEAM GENERATOR</Text>
      <Image source={warzone_number} style={styles.numbers}></Image>
    </View>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    padding: 10,
  },
  text: {
    color: "white",
    fontSize: 30,
    lineHeight: 40,
    height: 40,
    fontFamily: "Countach",
  },
  numbers: {
    height: 30,
    width: 30,
    marginTop: 2,
    marginLeft: 8,
  },
});
