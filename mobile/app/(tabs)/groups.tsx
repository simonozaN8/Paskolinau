import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, Plus, Users } from "lucide-react-native";
import { MobileAppBar } from "../../components/MobileAppBar";
import { Spinner } from "../../components/Spinner";
import { getRequests } from "../../lib/api";
import type { DashRequest } from "../../lib/types";
import { formatMoney } from "../../lib/constants";
import { colors, radius } from "../../lib/theme";

type Group = {
  groupId: string;
  title: string;
  members: DashRequest[];
  total: number;
  collected: number;
};

export default function GroupsScreen() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRequests()
      .then((all) => {
        const list = all as DashRequest[];
        const map = new Map<string, DashRequest[]>();
        list.filter((r) => r.groupId).forEach((r) => {
          const gid = r.groupId!;
          if (!map.has(gid)) map.set(gid, []);
          map.get(gid)!.push(r);
        });
        setGroups(
          Array.from(map.entries()).map(([groupId, members]) => ({
            groupId,
            title: members[0].description ?? "Grupė",
            members,
            total: members.reduce((s, m) => s + Number(m.amount), 0),
            collected: members
              .filter((m) => ["paid", "completed"].includes(m.status))
              .reduce((s, m) => s + Number(m.amount), 0),
          })),
        );
      })
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={s.screen}>
      <MobileAppBar variant="logo" />
      <View style={s.head}>
        <Text style={s.title}>Grupės</Text>
        <TouchableOpacity
          style={s.newBtn}
          onPress={() => router.push("/new-request")}
          activeOpacity={0.8}
        >
          <Plus size={14} color="#fff" />
          <Text style={s.newBtnText}>Nauja</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Spinner />
      ) : groups.length === 0 ? (
        <View style={s.empty}>
          <Users size={48} color={colors.slate200} />
          <Text style={s.emptyTitle}>Dar nėra grupių</Text>
          <Text style={s.emptySub}>Sukurkite grupinę rinkliavą ar padalinkite išlaidas</Text>
          <TouchableOpacity style={s.emptyCta} onPress={() => router.push("/new-request")}>
            <Plus size={16} color="#fff" />
            <Text style={s.emptyCtaText}>Sukurti grupę</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.list}>
          {groups.map((g) => {
            const pct = g.total > 0 ? Math.round((g.collected / g.total) * 100) : 0;
            const paid = g.members.filter((m) => ["paid", "completed"].includes(m.status)).length;
            return (
              <TouchableOpacity
                key={g.groupId}
                style={s.card}
                activeOpacity={0.85}
                onPress={() => router.push(`/group/${g.groupId}` as never)}
              >
                <View style={s.iconCircle}>
                  <Users size={20} color={colors.orange400} />
                </View>
                <View style={s.cardBody}>
                  <Text style={s.cardTitle} numberOfLines={1}>{g.title}</Text>
                  <Text style={s.cardSub}>{paid}/{g.members.length} sumokėjo</Text>
                  <View style={s.progressRow}>
                    <View style={s.progressTrack}>
                      <View style={[s.progressFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={s.pct}>{pct}%</Text>
                  </View>
                </View>
                <View style={s.cardRight}>
                  <Text style={s.amount}>{formatMoney(g.total)}</Text>
                  <Text style={s.collected}>{formatMoney(g.collected)} surinkta</Text>
                </View>
                <ChevronRight size={16} color={colors.slate300} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  title: { fontSize: 20, fontWeight: "700", color: colors.navy },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  newBtnText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: colors.white,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.orange50,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: colors.navy },
  cardSub: { fontSize: 12, color: colors.slate500, marginTop: 2 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.slate100, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: colors.green, borderRadius: 3 },
  pct: { fontSize: 10, fontWeight: "600", color: colors.green },
  cardRight: { alignItems: "flex-end" },
  amount: { fontSize: 14, fontWeight: "700", color: colors.navy },
  collected: { fontSize: 12, color: colors.slate400, marginTop: 2 },
  empty: { alignItems: "center", paddingHorizontal: 24, paddingTop: 64 },
  emptyTitle: { fontSize: 14, fontWeight: "500", color: colors.slate500, marginTop: 12 },
  emptySub: { fontSize: 12, color: colors.slate400, textAlign: "center", marginTop: 4 },
  emptyCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyCtaText: { fontSize: 14, fontWeight: "600", color: "#fff" },
});
