import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import LoadingScreen from "../../components/Loading";

export default function home() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <LoadingScreen />;

  console.log({ user });

  return (
    <View>
      <Text>Home Screen</Text>
      <Text>Welcome, {user?.fullName} 👽</Text>
      <Text>{user?.username} 👽</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
