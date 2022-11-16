import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  Platform,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useCallback } from "react";
import { Avatars } from "../utils/avatars";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { EvilIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

/*  interface ListItemProps
  extends Pick<PanGestureHandlerProps, "simultaneousHandlers"> {
  player: PlayerInterface;
  onDismiss?: (player: PlayerInterface) => void;
  onSave?: (player: PlayerInterface) => void;
} */

const CARD_HEIGHT = 90;
const CARD_WIDTH = 310;
const MAX_SLIDE_OFFSET = CARD_WIDTH * 0.3;

const clamp = (value, min, max) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

export const ListItem = ({
  player,
  onDismiss,
  onSave,
  simultaneousHandlers,
}) => {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(CARD_HEIGHT);
  const marginVertical = useSharedValue(15);
  const opacity = useSharedValue(1);
  const handleDeletePress = (id) => {
    onDismiss(id);
    translateX.value = withTiming(0);
  };
  const handleSavePress = (id) => {
    console.log(id);
    onSave(id);
    translateX.value = withTiming(0);
  };

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = clamp(
        event.translationX,
        -MAX_SLIDE_OFFSET,
        MAX_SLIDE_OFFSET
      );
    },
    onEnd: () => {
      const shouldBeSaved = translateX.value === MAX_SLIDE_OFFSET;
      const shouldBeDismissed = translateX.value === -MAX_SLIDE_OFFSET;
      if (shouldBeSaved) {
        runOnJS(handleSavePress)(player.id);
      }
      if (shouldBeDismissed && !player.isSaved) {
        runOnJS(handleDeletePress)(player.id);
      } else {
        translateX.value = withTiming(0);
      }
    },
  });
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const deleteIconContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(
      translateX.value < -20 && !player.isSaved ? 1 : 0
    );
    return { opacity };
  });

  const saveIconContainerStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value > 20 ? 1 : 0);
    return { opacity };
  });

  const rCardContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, rCardContainerStyle]}>
      <Animated.View
        style={[styles.deleteIconContainer, deleteIconContainerStyle]}>
        <EvilIcons name='trash' size={CARD_HEIGHT * 0.4} color='white' />
      </Animated.View>
      <Animated.View style={[styles.saveIconContainer, saveIconContainerStyle]}>
        <Entypo name='save' size={CARD_HEIGHT * 0.4} color='white' />
      </Animated.View>
      <PanGestureHandler
        simultaneousHandlers={simultaneousHandlers}
        onGestureEvent={panGesture}>
        <Animated.View style={[styles.card, rStyle]}>
          <Image
            source={Avatars[player.avatarPath + 1]}
            style={styles.cardAvatar}
          />
          <AntDesign
            style={[styles.star, player.isSaved && { opacity: 1 }]}
            name='star'
            size={24}
          />
          <AntDesign
            style={[styles.star, !player.isSaved && { opacity: 1 }]}
            name='staro'
            size={24}
          />
          <Text style={styles.cardText}>{player.name}</Text>
          <ImageBackground
            style={styles.cardBackground}
            resizeMode='cover'
            source={require("../assets/home_background.jpg")}
          />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  card: {
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
  star: {
    opacity: 0,
    position: "absolute",
    top: 5,
    right: 5,
    color: "rgb(255, 195, 13)",
  },
  deleteIconContainer: {
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "red",
    height: 90,
    width: MAX_SLIDE_OFFSET + 15,
    position: "absolute",
    right: "10%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  saveIconContainer: {
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    backgroundColor: "rgb(1,96,168)",
    height: 90,
    width: MAX_SLIDE_OFFSET + 15,
    position: "absolute",
    left: "10%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
});
