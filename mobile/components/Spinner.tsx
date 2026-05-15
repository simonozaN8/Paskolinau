import { ActivityIndicator, View, StyleSheet } from "react-native";
import { colors } from "../lib/theme";

export function Spinner({ size = "small" }: { size?: "small" | "large" }) {
  return (
    <View style={s.wrap}>
      <ActivityIndicator size={size} color={colors.green} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { paddingVertical: 40, alignItems: "center" },
});
