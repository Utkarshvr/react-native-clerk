import { Slot, router } from "expo-router";
import React from "react";
import LoadingScreen from "../../components/Loading";
import { useAuth } from "@clerk/clerk-expo";

export default function _layout() {
  const { isLoaded, isSignedIn } = useAuth();

  console.log({ isLoaded, isSignedIn });

  if (!isLoaded) return <LoadingScreen />;

  if (isSignedIn) {
    router.replace("/home");
    return null;
  }

  return <Slot />;
}
