import { StyleSheet, Text, View } from "react-native";

export default function LoadingScreen() {
  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>LOADING...</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
