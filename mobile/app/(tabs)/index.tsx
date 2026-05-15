import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import {
  Bell, CheckCircle2, ChevronRight, Check, FileText, PieChart, Plus, UserPlus, Users,
} from "lucide-react-native";
import { MobileAppBar } from "../../components/MobileAppBar";
import { RequestRow } from "../../components/RequestRow";
import { Spinner } from "../../components/Spinner";
import { useAuth } from "../../lib/AuthContext";
import { getRequests } from "../../lib/api";
import type { DashRequest } from "../../lib/types";
import { colors, radius } from "../../lib/theme";

const QUICK_ACTIONS = [
  { label: "Paskolinau", scenario: "loan", Icon: UserPlus },
  { label: "Padalinau", scenario: "split-bill", Icon: PieChart },
  { label: "Surenku", scenario: "group-fee", Icon: Users },
  { label: "Apmokėjau", scenario: "awaiting-share", Icon: CheckCircle2 },
] as const;

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<DashRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load(refresh = false) {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      setRequests((await getRequests()) as DashRequest[]);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const name = user?.firstName ?? "Vartotojau";
  const active = requests.filter((r) => ["active", "confirmed"].includes(r.status)).length;
  const paid = requests.filter((r) => ["paid", "completed"].includes(r.status)).length;
  const reminded = requests.filter((r) => r.status === "reminded").length;
  const recent = requests.slice(0, 4);

  return (
    <View style={s.screen}>
      <MobileAppBar variant="logo" />
      <ScrollView
        contentContainerStyle={s.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.green} />
        }
      >
        <View style={s.greeting}>
          <Text style={s.h1}>Labas, {name}! 👋</Text>
          <Text style={s.sub}>Sukurk. Išsiųsk. Sistema pasirūpins.</Text>
        </View>

        <View style={s.quickGrid}>
          {QUICK_ACTIONS.map(({ label, scenario, Icon }) => (
            <TouchableOpacity
              key={label}
              style={s.quickTile}
              onPress={() => router.push({ pathname: "/new-request", params: { scenario } })}
              activeOpacity={0.8}
            >
              <View style={s.quickIcon}>
                <Icon size={24} color={colors.navy} strokeWidth={1.8} />
              </View>
              <Text style={s.quickLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={s.cta}
          onPress={() => router.push("/new-request")}
          activeOpacity={0.85}
        >
          <View style={s.ctaLeft}>
            <View style={s.ctaPlus}>
              <Plus size={16} color="#fff" />
            </View>
            <Text style={s.ctaText}>Naujas prašymas</Text>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        <View style={s.sectionHead}>
          <Text style={s.sectionTitle}>Naujausi prašymai</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/history")} style={s.linkRow}>
            <Text style={s.link}>Žiūrėti visus</Text>
            <ChevronRight size={14} color={colors.green} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Spinner />
        ) : recent.length === 0 ? (
          <View style={s.empty}>
            <FileText size={40} color={colors.slate200} />
            <Text style={s.emptyText}>Dar nėra prašymų</Text>
          </View>
        ) : (
          <View style={s.list}>
            {recent.map((req) => (
              <RequestRow
                key={req.id}
                req={req}
                onPress={() => router.push(`/request/${req.id}` as never)}
              />
            ))}
          </View>
        )}

        <View style={s.stats}>
          {[
            { icon: <FileText size={20} color={colors.navy} />, value: loading ? "…" : active, label: "Aktyvūs prašymai" },
            { icon: <Check size={20} color={colors.green} />, value: loading ? "…" : paid, label: "Apmokėti prašymai" },
            { icon: <Bell size={20} color="#F59E0B" />, value: loading ? "…" : reminded, label: "Primintina" },
          ].map(({ icon, value, label }, i, arr) => (
            <View key={label} style={[s.statCell, i === arr.length - 1 && { borderRightWidth: 0 }]}>
              {icon}
              <Text style={s.statVal}>{value}</Text>
              <Text style={s.statLbl}>{label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingBottom: 24 },
  greeting: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 20 },
  h1: { fontSize: 24, fontWeight: "700", color: colors.navy },
  sub: { fontSize: 14, color: colors.slate500, marginTop: 2 },
  quickGrid: { flexDirection: "row", paddingHorizontal: 16, gap: 12, marginBottom: 20 },
  quickTile: {
    flex: 1,
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.white,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.slate50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickLabel: { fontSize: 11, fontWeight: "500", color: colors.navy, textAlign: "center" },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  ctaLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  ctaPlus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: colors.navy },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  link: { fontSize: 12, fontWeight: "600", color: colors.green },
  list: { paddingHorizontal: 16 },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 14, color: colors.slate400, marginTop: 12 },
  stats: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  statCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: colors.slate100,
    gap: 4,
  },
  statLbl: {
    fontSize: 10,
    color: colors.slate500,
    textAlign: "center",
    paddingHorizontal: 4,
    lineHeight: 14,
  },
  statVal: { fontSize: 20, fontWeight: "700", color: colors.navy },
});
