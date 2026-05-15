import { View, Text, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import type { SettlementLine } from "../lib/split-settlement";
import { formatEur } from "../lib/request-helpers";
import { colors, radius } from "../lib/theme";

type Props = {
  lines: SettlementLine[];
};

export function SplitSettlementCard({ lines }: Props) {
  if (!lines.length) {
    return (
      <View style={s.box}>
        <Text style={s.title}>Tarpusavio skolos</Text>
        <Text style={s.hint}>Visi atsiskaitė lygiai – papildomų pavedimų nereikia.</Text>
      </View>
    );
  }

  return (
    <View style={s.box}>
      <Text style={s.title}>Tarpusavio skolos (optimizuota)</Text>
      <Text style={s.hint}>
        Sistema perskaičiavo, kas kam kiek turėtų pervesti po to, kai skirtingi žmonės mokėjo skirtingas sąskaitas.
      </Text>
      {lines.map((line, i) => (
        <View key={`${line.from}-${line.to}-${i}`} style={s.line}>
          <Text style={s.person}>{line.from}</Text>
          <ArrowRight size={14} color={colors.green} />
          <Text style={s.person}>{line.to}</Text>
          <Text style={s.amount}>{formatEur(line.amount)}</Text>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  box: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.emerald50,
    backgroundColor: colors.green50,
    padding: 14,
    marginTop: 12,
  },
  title: { fontSize: 14, fontWeight: "700", color: colors.navy, marginBottom: 4 },
  hint: { fontSize: 12, color: colors.slate600, lineHeight: 18, marginBottom: 10 },
  line: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,200,83,0.15)",
  },
  person: { fontSize: 13, fontWeight: "600", color: colors.navy },
  amount: { marginLeft: "auto", fontSize: 13, fontWeight: "700", color: colors.green },
});
