import { Button, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import LoadingScreen from "../../components/Loading";
import axiosInstance from "../../config/axiosInstance";

export default function home() {
  const { user, isLoaded } = useUser();
  console.log({ isLoaded, user });

  const [userDB, setUserDB] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log({ user });

  const getMyProfile = async () => {
    setIsLoading(true);
    console.log({ commons: axiosInstance.defaults.headers.common });
    try {
      const { data } = await axiosInstance.get("/my-profile", {
        // headers: {
        //   "Clerk-Token": await getToken(),
        // },
      });
      console.log({ PROFILE: data?.profile });
      setUserDB(data?.profile);

      console.log("getMyProfile :: ", data);
    } catch (error) {
      console.log("getMyProfile :: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return <LoadingScreen />;

  return (
    <View style={{ flex: 1, gap: 24, padding: 24 }}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <Image
          source={{ uri: user?.imageUrl }}
          width={120}
          height={120}
          style={{ borderRadius: 999 }}
          alt="User Avatar"
        />
        <Text>{user?.fullName}</Text>
        <Text>{user?.username}</Text>
      </View>

      <Button onPress={getMyProfile} title="Get my database profile" />
      {userDB ? (
        isLoading ? (
          <Text>{"WAIT..."}</Text>
        ) : (
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {"From MongoDB"}
            </Text>
            <Image
              source={{ uri: userDB?.picture }}
              width={120}
              height={120}
              style={{ borderRadius: 999 }}
              alt="User Avatar"
            />
            <Text>{userDB?.email}</Text>
            <Text>{userDB?.username}</Text>
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({});
