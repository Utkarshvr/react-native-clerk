import * as WebBrowser from "expo-web-browser";
import { Button, View } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useCallback } from "react";
import useWarmUpBrowser from "../../hooks/useWarmUpBrowser";
WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  // console.log(Math.floor(100000 + Math.random() * 900000));

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

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

        console.log({
          //   signUp,
          missingFields,
          isUsernameMissing,
        });

        if (isUsernameMissing) {
          console.log("User name is missing, adding it BRO👽👽");
          // console.log(v4());
          const username = `${signUp.firstName}${
            signUp.lastName || ""
          }${Math.floor(100000 + Math.random() * 900000)}`;
          console.log({ username });
          try {
            await signUp.update({
              username,
            });
            console.log({ newSession: signUp.createdSessionId });

            setActive({ session: signUp.createdSessionId });
          } catch (error) {
            console.log(JSON.stringify(error));
            console.log(error.message);
            console.log(error.stack);
          }
        } else {
          console.log("User name is present");
        }
      }
    } catch (err) {
      console.dir(err);
      console.log("OAuth error", err);
      console.error("OAuth error message:", err.message);
      console.error("OAuth error stack:", err.stack);
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
      </View>
    </>
  );
};

export default SignInWithOAuth;
