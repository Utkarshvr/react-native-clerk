import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import tokenCache from "../config/tokenCache";
import { useEffect } from "react";
import { StatusBar, View } from "react-native";
import LoadingScreen from "../components/Loading";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_Y3VkZGx5LXBpcGVmaXNoLTM0LmNsZXJrLmFjY291bnRzLmRldiQ";

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(auth)";

    console.log("User changed: ", isSignedIn);

    if (isSignedIn && !inTabsGroup) {
      router.replace("/home");
    } else if (!isSignedIn) {
      router.replace("/signin");
    }
  }, [isSignedIn]);

  if (!isLoaded) return <LoadingScreen />;

  return <Slot />;
};

const RootLayout = () => {
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <StatusBar barStyle={"light-content"} backgroundColor={"#111"} />
      <InitialLayout />
    </ClerkProvider>
  );
};

export default RootLayout;
