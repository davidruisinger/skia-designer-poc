import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import { Editor } from "@/components/Editor";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Editor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
  },
});
