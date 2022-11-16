import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import { useFonts } from "expo-font";
import { useState, useRef } from "react";
import { Title } from "../components/Title";
import { ListItem } from "../components/ListItem";
import { Avatars } from "../utils/avatars";
import { Entypo } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { usePlayersState, useTeamsState } from "../states/PlayersState";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Home = ({ navigation }) => {
  // hookstate
  const playersState = usePlayersState();
  const players = playersState.getPlayers();
  const teamsState = useTeamsState();

  // ui visibility toggles
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlayerDiv, setNewPlayerDiv] = useState(false);

  // flag for when the modal close
  const [afterModal, setAfterModal] = useState(false);

  // text input state
  const [text, onChangeText] = React.useState("");

  // index that defines the selected avatar
  const [selectedAvatar, onChangeAvatar] = React.useState(1);

  const scrollRef = useRef(null);

  // it sets the visibility of the input for adding a new player
  const handleAddButton = () => {
    setNewPlayerDiv(true);
  };

  // it selects the avatar on tap in the modal and closes it
  const selectAvatar = (avatar) => {
    onChangeAvatar(Avatars[avatar]);
    handleModalClosing();
  };

  const handleModalClosing = () => {
    setAfterModal(true);
    setIsModalVisible(false);
  };

  // it adds a new player
  const handleSaveButton = () => {
    const uid = uuid.v4().slice(0, 6);
    const newPlayer = {
      avatarPath: selectedAvatar - 1,
      id: uid,
      name: text,
      isSaved: false,
    };
    playersState.addPlayer(newPlayer);
    onChangeAvatar(1);
    onChangeText("");
    setAfterModal(false);
  };
  const onDismiss = useCallback((id) => {
    playersState.removePlayer(id);
  }, []);

  const onSave = (id) => {
    if (id) {
      players.forEach((element) => {
        if (element.id == id) {
          playersState.lockPlayer(id);
        }
      });
    }
  };
  const handleShuffleButton = () => {
    teamsState.generateTeams();
    navigation.replace("Results");
  };
  const printSavedItems = async () => {
    try {
      const savedPlayers = await AsyncStorage.getItem("@storage_SavedPlayers");
      console.log("savedPlayers", savedPlayers);
    } catch (error) {
      console.log(error);
    }
  };

  /*   const printState = () => {
    console.log(players);
  }; */

  const clearStorage = async () => {
    await AsyncStorage.clear();
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
      {/* Modal */}
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={handleModalClosing}
        onBackdropPress={handleModalClosing}
        backdropOpacity={0.4}
        useNativeDriverForBackdrop
        swipeDirection={["down"]}
        propagateSwipe={true}
        scrollOffsetMax={height - MODAL_CONTENT_HEIGHT}
        style={styles.Modal}>
        <View style={styles.modalContent}>
          <AntDesign
            style={styles.navModalIcon}
            name='minus'
            size={100}
            color='white'
          />
          <ScrollView
            keyboardShouldPersistTaps='always'
            style={{ height: height - 80 }}>
            <View style={styles.avatarsGrid}>
              {Avatars &&
                Object.values(Avatars).map((element, index) => (
                  <TouchableOpacity
                    onPress={() => selectAvatar(index)}
                    key={index}>
                    <Image
                      style={styles.avatarsGridCard}
                      source={Avatars[index + 1]}
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
      <View style={styles.header}>
        <Title />
      </View>
      {/* Body of the Home page */}
      <ScrollView ref={scrollRef} style={styles.body}>
        <View style={styles.cardSection}>
          {newPlayerDiv && (
            <View style={[styles.card, { alignItems: "center" }]}>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <View>
                  <EvilIcons
                    style={styles.cardAvatarEditIcon}
                    name='pencil'
                    size={40}
                    color='white'
                  />
                  <Image
                    source={Avatars[selectedAvatar]}
                    style={styles.cardAvatar}
                  />
                </View>
              </TouchableOpacity>
              <TextInput
                autoFocus={true}
                style={styles.input}
                onChangeText={onChangeText}
                onSubmitEditing={text.length > 0 && handleSaveButton}
                placeholder={" Player name"}
                placeholderTextColor='rgba(255,255,255,0.4)'
                selectionColor={"rgba(255,255,255,0.4)"}
                blurOnSubmit={false}
                maxLength={30}
                value={text.length === 0 && text}
              />
            </View>
          )}
          {players.length > 0 &&
            players.map((item) => (
              <ListItem
                simultaneousHandlers={scrollRef}
                key={item.id}
                player={item}
                onDismiss={onDismiss}
                onSave={onSave}
              />
            ))}
        </View>
      </ScrollView>
      <ImageBackground
        style={styles.background}
        resizeMode='cover'
        source={require("../assets/home_background.jpg")}
      />
      {/* side buttons */}
      {afterModal && text.length > 0 ? (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.action}
          onPress={handleSaveButton}>
          <Entypo name='check' size={30} color='white' />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.action}
          onPress={handleAddButton}>
          <Entypo name='plus' size={30} color='white' />
        </TouchableOpacity>
      )}
      {players.length > 4 && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.action, { marginBottom: 80 }]}
          onPress={handleShuffleButton}>
          <Entypo name='shuffle' size={24} color='white' />
        </TouchableOpacity>
      )}
      {/* <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.action, { marginBottom: 160 }]}
        onPress={clearStorage}>
        <Entypo name='ccw' size={24} color='white' />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.action, { marginBottom: 240 }]}
        onPress={printState}>
        <Entypo name='print' size={30} color='white' />
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};
const { width, height } = Dimensions.get("window");
const MODAL_CONTENT_HEIGHT = (height - 80) * 0.8;
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
    height: height,
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
  Modal: {
    position: "absolute",
    bottom: 0,
    top: 80,
    left: -20,
    right: 0,
    width: width,
    maxHeight: height - 80,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: "rgb(20,20,20)",
  },
  modalContent: {
    height: MODAL_CONTENT_HEIGHT,
  },
  navModalIcon: {
    position: "absolute",
    top: -65,
    alignSelf: "center",
  },
  avatarsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  avatarsGridCard: {
    marginHorizontal: 4,
    marginVertical: 10,
    height: 95,
    width: 95,
    borderRadius: 10,
    elevation: 5,
  },
  cardSection: {
    justifyContent: "center",
    alignItems: "center",
  },
  carouselItem: {
    width: "90%",
    height: "90%",
    borderRadius: 5,
  },
  card: {
    width: 310,
    height: 90,
    backgroundColor: "rgba(85,98,76,0.2)",
    margin: 15,
    flexDirection: "row",
    shadowOpacity: 0.08,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    // Shadow for Android
    elevation: 5,
    borderRadius: 5,
  },
  cardAvatarEditIcon: {
    position: "absolute",
    zIndex: 2,
    top: "30%",
    left: "30%",
    opacity: 0.7,
  },
  cardAvatar: {
    width: 89,
    height: 89,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  input: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    fontFamily: "Countach",
    fontSize: 30,
    color: "white",
    textTransform: "uppercase",
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
  },
});
