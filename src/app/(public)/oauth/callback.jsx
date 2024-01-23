import { StyleSheet, Text, View } from "react-native";

import { useSignUp } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

export default function callback() {
  const { setActive, signUp, isLoaded } = useSignUp();

  console.log("CALLBACK :: \n");
  console.log(signUp.emailAddress, isLoaded);

  return (
    <View>
      <Text>callback</Text>
    </View>
  );
}
