import * as WebBrowser from "expo-web-browser";
import { Button, View } from "react-native";
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { useCallback } from "react";
import useWarmUpBrowser from "../../hooks/useWarmUpBrowser";
import { Link } from "expo-router";
WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({
    strategy: "oauth_google",
    redirectUrl: "exp://192.168.29.190:8081/--/oauth/callback",
  });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive, authSessionResult } =
        await startOAuthFlow();

      console.log({ authSessionResult, createdSessionId });

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        const missingFields = signUp.missingFields;
        const isUsernameMissing = missingFields.some((e) => e === "username");
        if (isUsernameMissing) {
          // Ask the user to fill in his username
          // Ask the user to fill in his username
          Alert.prompt("Enter your username", null, (text) => {
            if (text) {
              setUsername(text);

              // After the user submits the username, you can continue the authentication flow
              signUp
                .update({
                  username: text,
                })
                .then(() => {
                  // Continue the authentication flow
                  // You can add your logic here, for example, calling startOAuthFlow again
                  console.log("Username submitted:", text);
                })
                .catch((error) => {
                  console.error("Error updating username:", error);
                });
            } else {
              // Handle the case where the user did not enter a username
              console.warn("Username is required");
            }
          });
        }
      }
    } catch (err) {
      console.log("OAUTH ERROR:\n ", JSON.stringify(err));
    }
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: "#111",
          gap: 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button title="Sign in with Google" onPress={onPress} />

        <Link asChild href={"/register"}>
          <Button title="Register" />
        </Link>
      </View>
    </>
  );
};

export default SignInWithOAuth;
