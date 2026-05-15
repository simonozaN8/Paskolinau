import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Check, FileText, Rocket, RotateCcw, Shield } from "lucide-react-native";
import { MobileAppBar } from "../../components/MobileAppBar";
import { colors, radius } from "../../lib/theme";

const FEATURES = [
  "Automatiniai priminimai",
  "Grupės ir bendri rinkiniai",
  "Mokėjimų istorija",
  "PDF dokumentai",
  "Prioritetinis palaikymas",
];

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0 €",
    period: "",
    note: "Visada nemokamai",
    features: [true, false, true, false, false],
    cta: "Dabartinis planas",
    navy: false,
    featured: false,
  },
  {
    id: "plus",
    name: "Plus",
    price: "4,99 €",
    period: "/mėn.",
    note: "Daugiau galimybių tau",
    features: [true, true, true, true, false],
    cta: "Pasirinkti Plus",
    navy: true,
    featured: true,
  },
  {
    id: "team",
    name: "Team",
    price: "9,99 €",
    period: "/mėn.",
    note: "Komandoms ir šeimoms",
    features: [true, true, true, true, true],
    cta: "Pasirinkti Team",
    navy: false,
    featured: false,
  },
] as const;

const DOCS = [
  { Icon: FileText, label: "Skolos įrašas PDF", bg: colors.red50, iconColor: "#EF4444" },
  { Icon: FileText, label: "Skolos raštelis", bg: colors.blue50, iconColor: "#3B82F6" },
  { Icon: Shield, label: "Paskolos sutartis", bg: colors.slate50, iconColor: colors.navy },
  { Icon: FileText, label: "Mokėjimo grafikas", bg: colors.green50, iconColor: colors.green },
];

export default function PremiumScreen() {
  return (
    <View style={s.screen}>
      <MobileAppBar variant="logo" />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={s.h1}>Premium planai</Text>
        <Text style={s.sub}>Pasirink planą, kuris geriausiai tinka tau.</Text>

        <View style={s.plansRow}>
          {PLANS.map((plan) => (
            <View
              key={plan.id}
              style={[s.planCard, plan.featured && s.planFeatured]}
            >
              {plan.featured && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>Populiariausias</Text>
                </View>
              )}
              <Text style={s.planName}>{plan.name}</Text>
              <Text style={s.planPrice}>
                {plan.price}
                <Text style={s.planPeriod}>{plan.period}</Text>
              </Text>
              <Text style={s.planNote}>{plan.note}</Text>
              {FEATURES.map((f, i) => (
                <View key={f} style={s.featRow}>
                  <Check
                    size={14}
                    color={plan.features[i] ? colors.green : colors.slate200}
                    strokeWidth={3}
                  />
                  <Text style={[s.featText, !plan.features[i] && s.featOff]}>{f}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={[s.planBtn, plan.navy ? s.planBtnNavy : s.planBtnOutline]}
                activeOpacity={0.8}
              >
                <Text style={[s.planBtnText, plan.navy && { color: "#fff" }]}>{plan.cta}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={s.trustRow}>
          {[
            { Icon: Shield, title: "Saugus ir patikimas", sub: "Jūsų duomenys apsaugoti." },
            { Icon: RotateCcw, title: "Atsisakyk bet kada", sub: "Jokių įsipareigojimų." },
          ].map(({ Icon, title, sub }) => (
            <View key={title} style={s.trustCard}>
              <Icon size={20} color={colors.green} />
              <View style={{ flex: 1 }}>
                <Text style={s.trustTitle}>{title}</Text>
                <Text style={s.trustSub}>{sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={s.docH}>Premium dokumentai</Text>
        <Text style={s.docSub}>Kurkite, eksportuokite ir siųskite svarbius dokumentus.</Text>
        <View style={s.docGrid}>
          {DOCS.map(({ Icon, label, bg, iconColor }) => (
            <View key={label} style={s.docTile}>
              <View style={[s.docIcon, { backgroundColor: bg }]}>
                <Icon size={24} color={iconColor} />
              </View>
              <Text style={s.docLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.trialBtn} activeOpacity={0.85}>
          <Rocket size={20} color="#fff" />
          <Text style={s.trialText}>Pradėti 7 d. nemokamai</Text>
        </TouchableOpacity>
        <Text style={s.trialNote}>Po 7 dienų bus taikomas pasirinkto plano mokestis.</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: 16, paddingBottom: 32 },
  h1: { fontSize: 24, fontWeight: "700", color: colors.navy, marginTop: 4 },
  sub: { fontSize: 14, color: colors.slate500, marginTop: 4, marginBottom: 16 },
  plansRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  planCard: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate200,
    padding: 12,
    paddingTop: 16,
  },
  planFeatured: { borderColor: colors.green, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  badge: {
    position: "absolute",
    top: -10,
    alignSelf: "center",
    left: "10%",
    right: "10%",
    backgroundColor: colors.green,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#fff", textAlign: "center" },
  planName: { fontSize: 14, fontWeight: "700", color: colors.navy },
  planPrice: { fontSize: 16, fontWeight: "700", color: colors.navy, marginTop: 4 },
  planPeriod: { fontSize: 12, fontWeight: "400", color: colors.slate500 },
  planNote: { fontSize: 10, color: colors.slate500, marginTop: 4, lineHeight: 14 },
  featRow: { flexDirection: "row", alignItems: "flex-start", gap: 4, marginTop: 6 },
  featText: { fontSize: 10, color: colors.slate600, flex: 1, lineHeight: 14 },
  featOff: { color: colors.slate300 },
  planBtn: { marginTop: 12, borderRadius: radius.md, paddingVertical: 8, alignItems: "center" },
  planBtnNavy: { backgroundColor: colors.navy },
  planBtnOutline: { borderWidth: 1, borderColor: colors.slate200 },
  planBtnText: { fontSize: 11, fontWeight: "600", color: colors.navy },
  trustRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  trustCard: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: 12,
  },
  trustTitle: { fontSize: 12, fontWeight: "600", color: colors.navy },
  trustSub: { fontSize: 11, color: colors.slate500, marginTop: 2 },
  docH: { fontSize: 16, fontWeight: "700", color: colors.navy },
  docSub: { fontSize: 14, color: colors.slate500, marginTop: 2, marginBottom: 16 },
  docGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  docTile: {
    width: "47%",
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: 16,
  },
  docIcon: { width: 48, height: 48, borderRadius: radius.lg, alignItems: "center", justifyContent: "center" },
  docLabel: { fontSize: 12, fontWeight: "600", color: colors.navy, textAlign: "center", marginTop: 8 },
  trialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    paddingVertical: 16,
    marginTop: 20,
  },
  trialText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  trialNote: { fontSize: 12, color: colors.slate400, textAlign: "center", marginTop: 8 },
});
