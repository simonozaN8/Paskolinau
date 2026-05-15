import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight, FileText, Gift, PieChart, ShoppingCart, Users } from "lucide-react-native";
import type { DashRequest } from "../lib/types";
import { formatDate, formatMoney, requestTitle } from "../lib/constants";
import { StatusBadge } from "./StatusBadge";
import { colors } from "../lib/theme";

function ScenarioIcon({ scenario }: { scenario?: string }) {
  const props = { size: 20, color: colors.green };
  switch (scenario) {
    case "loan": return <ShoppingCart {...props} />;
    case "group-fee": return <Users {...props} />;
    case "split-bill": return <PieChart {...props} />;
    case "awaiting-share": return <Gift {...props} />;
    default: return <FileText size={20} color={colors.slate400} />;
  }
}

type Props = {
  req: DashRequest;
  onPress?: () => void;
  subtitleExtra?: string;
};

export function RequestRow({ req, onPress, subtitleExtra }: Props) {
  const subtitle = [
    subtitleExtra,
    formatDate(req.dueDate),
    req.groupId ? "Grupė" : null,
  ].filter(Boolean).join(subtitleExtra?.includes("·") ? " " : " · ");

  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <View style={s.iconCircle}>
        <ScenarioIcon scenario={req.scenario} />
      </View>
      <View style={s.body}>
        <Text style={s.title} numberOfLines={1}>{requestTitle(req)}</Text>
        <Text style={s.sub} numberOfLines={1}>{subtitle}</Text>
      </View>
      <View style={s.right}>
        <Text style={s.amount}>{formatMoney(req.amount)}</Text>
        <StatusBadge status={req.status} />
      </View>
      {onPress && <ChevronRight size={16} color={colors.slate300} />}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.slate50,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, fontWeight: "600", color: colors.navy },
  sub: { fontSize: 12, color: colors.slate400, marginTop: 2 },
  right: { alignItems: "flex-end", gap: 4 },
  amount: { fontSize: 14, fontWeight: "700", color: colors.navy },
});
