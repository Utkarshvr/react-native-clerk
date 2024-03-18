import * as SecureStore from "expo-secure-store";

import { useAuth, useUser } from "@clerk/clerk-react";
import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import LoadingScreen from "../../components/Loading";
import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";

export default function _layout() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [isUserDBLoggedIn, setIsUserDBLoggedIn] = useState(false);

  const loginUser = async () => {
    const userInfo = {
      clerkID: user?.id,

      username: user?.username,
      picture: user?.imageUrl,
      email: user?.emailAddresses[0].emailAddress,
    };
    console.log({ userInfo });

    try {
      const { data } = await axiosInstance.post("/auth/login", userInfo, {
        headers: { "Clerk-Token": await getToken() },
      });
      axiosInstance.defaults.headers.common["jwt-token"] = data?.jwtToken;

      // Save token
      await SecureStore.setItemAsync(
        "jwt-token",
        JSON.stringify(data?.jwtToken)
      );

      setIsUserDBLoggedIn(true);
      console.log("loginUser :: ", data);
    } catch (error) {
      console.log("loginUser :: ", JSON.stringify(error));
    }
  };

  const saveTokens = async () => {
    if (isLoaded && isSignedIn) {
      const jwt_token = SecureStore.getItem("jwt-token");
      axiosInstance.defaults.headers.common["jwt-token"] = jwt_token;

      const ClerkToken = await getToken();
      axiosInstance.defaults.headers.common["Clerk-Token"] = ClerkToken;
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      saveTokens();
      loginUser();
    } else if (isLoaded && !isSignedIn) router.replace("/signin");
  }, [isLoaded, isSignedIn, user]);

  console.log({ isUserDBLoggedIn, isLoaded });

  if (!isLoaded) return <LoadingScreen />;

  // if (isSignedIn) {
  //   router.replace("/signin");
  //   return null;
  // }

  return (
    <Tabs
      screenOptions={{
        headerRight: () => <LogoutButton />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Home",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={"#111"} />
    </Pressable>
  );
};
