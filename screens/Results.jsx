import React, { useState } from "react";
import {
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Title } from "../components/Title";
import { useFonts } from "expo-font";
import { useTeamsState } from "../states/PlayersState";
import { ScrollView } from "react-native-gesture-handler";
import { TeamItem } from "../components/TeamItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
export const Results = ({ navigation }) => {
  const teamsState = useTeamsState();
  const teams = teamsState.getTeams();
  const Names = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Fox", "Guard"];
  //console.log("teams in results", teams);
  const [actionsAreVisible, setactionsAreVisible] = useState(true);
  const resetTeams = () => {
    teamsState.resetTeams();
    navigation.replace("Home");
  };

  const viewShot = React.useRef();
  captureAndShareScreenshot = () => {
    setactionsAreVisible(false);
    viewShot.current.capture().then((uri) => {
      console.log("do something with ", uri);
      Sharing.shareAsync("file://" + uri);
    }),
      setactionsAreVisible(true);
    (error) => console.error("Oops, snapshot failed", error);
  };

  // custom font
  const [loaded] = useFonts({
    Countach: require("../assets/fonts/Countach.otf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <Title />
      </View>
      <ScrollView style={styles.body}>
        <ViewShot
          ref={viewShot}
          options={{
            format: "jpg",
            quality: 0.9,
          }}>
          <View style={styles.cardSection}>
            {teams.map((team, index) => {
              return (
                <View key={index} style={styles.teamsWrapper}>
                  <Text style={styles.teamTitle}>{`TEAM ${Names[
                    index
                  ].toUpperCase()}`}</Text>
                  {team.map((player) => {
                    return <TeamItem key={player.id} player={player} />;
                  })}
                </View>
              );
            })}
          </View>
        </ViewShot>
      </ScrollView>
      <ImageBackground
        style={styles.background}
        resizeMode='cover'
        source={require("../assets/home_background.jpg")}
      />
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.action,
          actionsAreVisible && { opacity: 1 },
          { marginBottom: 80 },
        ]}
        onPress={captureAndShareScreenshot}>
        <Entypo name='share' size={30} color='white' />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.action, actionsAreVisible && { opacity: 1 }]}
        onPress={resetTeams}>
        <MaterialCommunityIcons name='restart' size={30} color='white' />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
  },
  header: {
    height: 70,
    width: width + 20,
    marginTop: -10,
    paddingTop: 10,
    marginHorizontal: -10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  body: {
    marginBottom: 50,
    backgroundColor: "transparent",
  },
  background: {
    height: height,
    zIndex: -1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardSection: {
    justifyContent: "center",
    alignItems: "center",
  },
  teamsWrapper: {
    marginVertical: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  teamTitle: {
    marginBottom: 15,
    fontSize: 30,
    color: "white",
    fontFamily: "Countach",
    textAlign: "center",
  },
  action: {
    position: "absolute",
    right: 20,
    bottom: 20,
    height: 60,
    width: 60,
    backgroundColor: "rgb(72,121,38)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    opacity: 0,
  },
});
