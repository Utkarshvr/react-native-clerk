import { Button, TextInput, View, StyleSheet, Text } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
// import Spinner from "react-native-loading-spinner-overlay";
import { useState } from "react";
import { Stack, router } from "expo-router";

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [pendingUsername, setPendingUsername] = useState(false);
  const [username, setUsername] = useState(null);

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      const isUsernameMissing = completeSignUp.missingFields.some(
        (e) => "username"
      );

      if (isUsernameMissing) {
        return setPendingUsername(true);
      }

      if (completeSignUp.createdSessionId) {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/home");
      }

      console.log({ completeSignUp, session: completeSignUp.createdSessionId });
    } catch (err) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // set the username
  const onPressUsername = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.update({ username });
      console.log({ session: completeSignUp.createdSessionId });

      if (completeSignUp.createdSessionId) {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/home");
      }
    } catch (err) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      {/* <Spinner visible={loading} /> */}

      {loading && <Text>LOADING...</Text>}

      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize="none"
            placeholder="simon@galaxies.dev"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />
          <TextInput
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputField}
          />

          <Button
            onPress={onSignUpPress}
            title="Sign up"
            color={"#6c47ff"}
          ></Button>
        </>
      )}

      {pendingVerification && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              style={styles.inputField}
              onChangeText={setCode}
            />
          </View>
          <Button
            onPress={onPressVerify}
            title="Verify Email"
            color={"#6c47ff"}
          ></Button>
        </>
      )}

      {pendingUsername && (
        <>
          <View>
            <TextInput
              value={username}
              placeholder="username123..."
              style={styles.inputField}
              onChangeText={setUsername}
            />
          </View>
          <Button
            onPress={onPressUsername}
            title="Set Username"
            color={"#6c47ff"}
          ></Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default Register;
