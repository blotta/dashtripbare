import { View } from "react-native";
import React from "react";
import { ActivityIndicator, Text } from "react-native-paper";

export default function Loading({ message = null, children = null }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {children ? (
        children
      ) : (
        <>
          {message && <Text style={{ textAlign: "center" }}>{message}</Text>}
          <ActivityIndicator animating={true} />
        </>
      )}
    </View>
  );
}
