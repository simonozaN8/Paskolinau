import { Text, View, StyleSheet } from "react-native";
import { STATUS_LABELS, STATUS_STYLES } from "../lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.active;
  return (
    <View style={[s.badge, { backgroundColor: style.bg }]}>
      <Text style={[s.text, { color: style.text }]}>
        {STATUS_LABELS[status] ?? "Laukia"}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 },
  text: { fontSize: 10, fontWeight: "600" },
});
