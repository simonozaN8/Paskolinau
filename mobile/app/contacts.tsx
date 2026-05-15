import { View, Text, StyleSheet } from "react-native";
import { MobileAppBar } from "../components/MobileAppBar";
import { colors } from "../lib/theme";

export default function ContactsPlaceholder() {
  return (
    <View style={s.root}>
      <MobileAppBar variant="back" title="Mano kontaktai" />
      <View style={s.body}>
        <Text style={s.text}>Kontaktų sąrašas – netrukus.</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  body: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 14, color: colors.slate500 },
});
