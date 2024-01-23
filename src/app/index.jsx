import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function index() {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Link asChild href={"/signin"}>
        <Button title="Go to signin screen" />
      </Link>
      <Text>index</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
