import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Home } from "./screens/Home";
import { Intro } from "./screens/Intro";
import { Results } from "./screens/Results";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import React from "react";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar hidden />
          <Stack.Navigator>
            <Stack.Screen
              name='Intro'
              component={Intro}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Home'
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Results'
              component={Results}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
    // </Provider>
  );
}
