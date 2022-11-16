import {
  StyleSheet,
  Text,
  Dimensions,
  Pressable,
  Animated,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import { useFonts } from "expo-font";
import { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Title } from "../components/Title";
import React from "react";

//assets import
const ghost = require("../assets/ghost.png");
const intro_video = require("../assets/trimmed_intro_video.mp4");

export const Intro = ({ navigation }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoginButtonVisible, setIsLoginButtonVisible] = useState(true);
  const [shouldPlay, setShouldPlay] = useState(true);
  /*   //status update during the playback
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const updateStatus = (status) => {
    setIsPlaying(status.isPlaying);
    setPlaybackTime(status.positionMillis);
  };
 */

  const pulse = useRef(new Animated.Value(0.2)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(pulse, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      Animated.timing(pulse, {
        toValue: 0.2,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, [isMuted]);

  useEffect(() => {
    setTimeout(() => {
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    }, 3000);
    setTimeout(() => {
      setIsLoginButtonVisible(true);
    }, 1200);
  });

  const handleLoginPress = () => {
    setShouldPlay(false);
    navigation.replace("Home");
  };
  const [loaded] = useFonts({
    Countach: require("../assets/fonts/Countach.otf"),
  });

  if (!loaded) {
    return null;
  }
  return (
    // Overlay to toggle the audio
    <Pressable style={styles.container} onPress={() => setIsMuted(!isMuted)}>
      <Video
        resizeMode={ResizeMode.COVER}
        source={intro_video}
        isMuted={isMuted}
        posterSource={ghost}
        isLooping={true}
        shouldPlay={shouldPlay}
        style={styles.backgroundVideo}
      />
      <Title />
      {isLoginButtonVisible && (
        <Animated.View
          style={[
            styles.loginButton,
            {
              opacity: fadeIn,
            },
          ]}>
          <Pressable onPress={handleLoginPress} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login as guest</Text>
          </Pressable>
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.buttonWrapper,
          {
            opacity: pulse,
          },
        ]}>
        {isMuted ? (
          <Ionicons name='ios-volume-mute-outline' size={20} color='white' />
        ) : (
          <Ionicons name='ios-volume-high-outline' size={20} color='white' />
        )}
      </Animated.View>
    </Pressable>
  );
};
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    height: height,
    width: width,
  },
  buttonWrapper: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "black",
    borderRadius: 50,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "stretch",
    bottom: 0,
    right: 0,
  },
  background: {
    height: height,
    width: width,
    justifyContent: "center",
  },
  /*   textWrapper: {
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
  }, */
  loginButton: {
    width: 180,
    height: 40,
    backgroundColor: "rgba(72,121,38,0.9)",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  loginButtonText: {
    color: "white",
    letterSpacing: 1.3,
    fontFamily: "Countach",
    fontSize: 20,
  },
});
