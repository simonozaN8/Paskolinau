import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronRight, Clock, Package } from "lucide-react-native";
import type { DashRequest } from "../lib/types";
import { formatDate, formatMoney } from "../lib/constants";
import { StatusBadge } from "./StatusBadge";
import { colors } from "../lib/theme";

type Props = {
  request: DashRequest;
  onPress?: () => void;
};

export function SingleRequestCard({ request: r, onPress }: Props) {
  return (
    <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.75} disabled={!onPress}>
      <View style={s.body}>
        <Text style={s.name} numberOfLines={1}>{r.recipientName}</Text>
        <View style={s.meta}>
          <Clock size={12} color={colors.slate400} />
          <Text style={s.metaText}>{formatDate(r.dueDate)}</Text>
        </View>
        {r.status === "paid" && (
          <Text style={s.paidHint}>Laukia jūsų patvirtinimo</Text>
        )}
      </View>
      <View style={s.right}>
        {r.itemDescription ? (
          <View style={s.itemRow}>
            <Package size={14} color={colors.slate400} />
            <Text style={s.itemText} numberOfLines={1}>{r.itemDescription}</Text>
          </View>
        ) : (
          <Text style={s.amount}>{formatMoney(r.amount)}</Text>
        )}
        <StatusBadge status={r.status} />
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
    paddingVertical: 4,
  },
  body: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: "600", color: colors.navy },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  metaText: { fontSize: 12, color: colors.slate500 },
  paidHint: { fontSize: 11, color: colors.green, marginTop: 4 },
  right: { alignItems: "flex-end", gap: 6 },
  amount: { fontSize: 14, fontWeight: "700", color: colors.navy },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 4, maxWidth: 100 },
  itemText: { fontSize: 12, fontWeight: "600", color: colors.navy },
});
