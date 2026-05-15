import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell, MoreHorizontal } from "lucide-react-native";
import { colors } from "../lib/theme";

const logo = require("../assets/icon.png");

type Props = {
  variant?: "logo" | "back";
  title?: string;
  showMore?: boolean;
  onBack?: () => void;
};

export function MobileAppBar({ variant = "logo", title, showMore, onBack }: Props) {
  const router = useRouter();

  return (
    <View style={s.row}>
      {variant === "back" ? (
        <TouchableOpacity
          style={s.circleBtn}
          onPress={onBack ?? (() => router.back())}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={colors.navy} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={s.logoRow} onPress={() => router.push("/(tabs)")} activeOpacity={0.8}>
          <Image source={logo} style={s.logo} />
          <Text style={s.logoText}>
            Paskolinau<Text style={s.logoGreen}>.lt</Text>
          </Text>
        </TouchableOpacity>
      )}

      {variant === "back" && title ? (
        <Text style={s.backTitle} numberOfLines={1}>{title}</Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      <View style={s.right}>
        {showMore && (
          <TouchableOpacity style={s.circleBtn} activeOpacity={0.7}>
            <MoreHorizontal size={20} color={colors.navy} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={s.circleBtn} activeOpacity={0.7}>
          <Bell size={20} color={colors.navy} />
          <View style={s.bellDot} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  logo: { width: 36, height: 36 },
  logoText: { fontSize: 18, fontWeight: "700", color: colors.navy },
  logoGreen: { color: colors.green },
  backTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: colors.navy,
    marginHorizontal: 8,
  },
  right: { flexDirection: "row", alignItems: "center", gap: 4 },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    right: 6,
    top: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
});
