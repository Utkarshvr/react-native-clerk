// import * as WebBrowser from "expo-web-browser";
// import { Button, View } from "react-native";
// import { useOAuth } from "@clerk/clerk-expo";
// import { useCallback } from "react";
// import useWarmUpBrowser from "../../hooks/useWarmUpBrowser";
// import { Link } from "expo-router";
// WebBrowser.maybeCompleteAuthSession();

// const SignInWithOAuth = () => {
//   // Warm up the android browser to improve UX
//   // https://docs.expo.dev/guides/authentication/#improving-user-experience
//   useWarmUpBrowser();

//   // console.log(Math.floor(100000 + Math.random() * 900000));

//   const { startOAuthFlow } = useOAuth({
//     strategy: "oauth_google",
//     redirectUrl: "exp://192.168.29.190:8081/--/oauth/callback",
//   });

//   const onPress = useCallback(async () => {
//     try {
//       const { createdSessionId, signIn, signUp, setActive, authSessionResult } =
//         await startOAuthFlow();

//       console.log({ authSessionResult, createdSessionId });

//       if (createdSessionId) {
//         setActive({ session: createdSessionId });
//       } else {
//         // const missingFields = signUp.missingFields;
//         // const isUsernameMissing = missingFields.some((e) => e === "username");

//         // console.log({
//         //   //   signUp,
//         //   missingFields,
//         //   isUsernameMissing,
//         // });

//         // if (isUsernameMissing) {
//         //   console.log("User name is missing, adding it BRO👽👽");
//         //   // const username = `${signUp.firstName}${
//         //   //   signUp.lastName || ""
//         //   // }${Math.floor(100000 + Math.random() * 900000)}`;
//         //   // console.log({ username });
//         //   try {
//         //     await signUp.update({
//         //       username,
//         //     });
//         //     console.log({ newSession: signUp.createdSessionId });

//         //     setActive({ session: signUp.createdSessionId });
//         //   } catch (error) {
//         //     console.log(JSON.stringify(error));
//         //     console.log(error.message);
//         //     console.log(error.stack);
//         //   }
//         // } else {
//         //   console.log("User name is present");
//         // }
//       }
//     } catch (err) {
//       console.log("OAUTH ERROR:\n ", JSON.stringify(err));
//     }
//   }, []);

//   return (
//     <>
//       <View
//         style={{
//           flex: 1,
//           backgroundColor: "#111",
//           gap: 12,
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Button title="Sign in with Google" onPress={onPress} />

//         <Link asChild href={"/register"}>
//           <Button title="Register" />
//         </Link>
//       </View>
//     </>
//   );
// };

// export default SignInWithOAuth;

import * as WebBrowser from "expo-web-browser";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { useCallback, useState } from "react";
import useWarmUpBrowser from "../../hooks/useWarmUpBrowser";
import { Link, router } from "expo-router";
WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { setActive, signUp, isLoaded } = useSignUp();

  const [username, setUsername] = useState("");
  const [isUsernameMissing, setIsUsernameMissing] = useState(false);
  const [usernameLoginLoading, setUsernameLoginLoading] = useState(false);

  const [globalLoading, setGlobalLoading] = useState(false);
  console.log({ globalLoading });

  const { startOAuthFlow } = useOAuth({
    strategy: "oauth_google",
    redirectUrl: "exp://192.168.29.190:8081/--/signin",
  });

  const onPress = useCallback(async () => {
    try {
      setGlobalLoading(true);
      const { createdSessionId, authSessionResult } = await startOAuthFlow();

      console.log({ authSessionResult, createdSessionId });

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/home");
      } else {
        const missingFields = signUp.missingFields;
        const isUsernameMissing = missingFields.some((e) => e === "username");
        if (isUsernameMissing) setIsUsernameMissing(true);

        // if (isUsernameMissing) {
        //   // Ask the user to fill in his username
        //   console.log("User name is missing, adding it BRO👽👽");
        //   const username = `${signUp.firstName}${
        //     signUp.lastName || ""
        //   }${Math.floor(100000 + Math.random() * 900000)}`;
        //   console.log({ username });

        //   try {
        //     await signUp.update({
        //       username,
        //     });
        //     console.log({ newSession: signUp.createdSessionId });
        //     setActive({ session: signUp.createdSessionId });
        //   } catch (error) {
        //     console.log(JSON.stringify(error));
        //     console.log(error.message);
        //     console.log(error.stack);
        //   }
        // }
      }
    } catch (err) {
      console.log("OAUTH ERROR:\n ", JSON.stringify(err));
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  const onUsernamePress = async () => {
    setUsernameLoginLoading(true);
    try {
      const completeSignUp = await signUp.update({ username });
      setGlobalLoading(true);

      console.log({ session: completeSignUp.createdSessionId });

      if (completeSignUp.createdSessionId) {
        setActive({ session: completeSignUp.createdSessionId });
        router.push("/home");
      } else {
        console.log("Still something went wrong 🙂");
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      alert(err.errors[0].message);
    } finally {
      setGlobalLoading(false);
      setUsernameLoginLoading(false);
    }
  };

  if (globalLoading)
    return (
      <>
        <View style={styles.container}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>LOADING...</Text>
        </View>
      </>
    );

  if (isUsernameMissing)
    return (
      <View style={styles.container}>
        {usernameLoginLoading ? (
          <Text>Wait...</Text>
        ) : (
          <>
            <Text>Username is required</Text>
            <TextInput
              placeholder="Username..."
              value={username}
              onChangeText={setUsername}
              style={styles.inputField}
            />
            <Button
              color={"#6c47ff"}
              title="Continue 🔐"
              onPress={onUsernamePress}
            />
          </>
        )}
      </View>
    );

  return (
    <>
      <View style={styles.container}>
        <Button
          color={"#6c47ff"}
          title="👽Sign in with Google 👽"
          onPress={onPress}
        />

        <Text style={{ fontSize: 20, fontWeight: "bold" }}>OR</Text>

        <Link asChild href={"/register"}>
          <Button color={"#111"} title="👽 Register With (Email/Password) 👽" />
        </Link>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default SignInWithOAuth;
