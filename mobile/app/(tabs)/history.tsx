import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { FileText } from "lucide-react-native";
import { MobileAppBar } from "../../components/MobileAppBar";
import { GroupRequestCard } from "../../components/GroupRequestCard";
import { SingleRequestCard } from "../../components/SingleRequestCard";
import { Spinner } from "../../components/Spinner";
import { getRequests } from "../../lib/api";
import {
  filterGroupedByTab,
  groupRequests,
  type HistoryTab,
} from "../../lib/request-groups";
import type { DashRequest } from "../../lib/types";
import { colors, radius } from "../../lib/theme";

const TABS: HistoryTab[] = ["Visi", "Aktyvūs", "Apmokėti", "Atšaukti"];

export default function HistoryScreen() {
  const router = useRouter();
  const [requests, setRequests] = useState<DashRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<HistoryTab>("Visi");

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      setRequests(await getRequests());
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = filterGroupedByTab(groupRequests(requests), tab);

  return (
    <View style={s.screen}>
      <MobileAppBar variant="logo" />
      <Text style={s.title}>Istorija</Text>

      <View style={s.tabBar}>
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <TouchableOpacity
              key={t}
              style={[s.tab, active && s.tabActive]}
              onPress={() => setTab(t)}
              activeOpacity={0.85}
            >
              <Text style={[s.tabText, active && s.tabTextActive]} numberOfLines={1}>
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <Spinner />
      ) : grouped.length === 0 ? (
        <View style={s.empty}>
          <FileText size={48} color={colors.slate200} />
          <Text style={s.emptyText}>Prašymų nerasta</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={s.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor={colors.green}
            />
          }
        >
          {grouped.map((group) =>
            group.length > 1 ? (
              <GroupRequestCard
                key={group[0].groupId!}
                requests={group}
                onRefresh={() => load(true)}
              />
            ) : (
              <View key={group[0].id} style={s.singleWrap}>
                <SingleRequestCard
                  request={group[0]}
                  onPress={() => router.push(`/request/${group[0].id}` as never)}
                />
              </View>
            ),
          )}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.navy,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 6,
    backgroundColor: colors.slate50,
    borderRadius: radius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 10,
    minHeight: 40,
  },
  tabActive: {
    backgroundColor: colors.navy,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate600,
    textAlign: "center",
  },
  tabTextActive: { color: colors.white },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  singleWrap: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  empty: { flex: 1, alignItems: "center", paddingTop: 64 },
  emptyText: { fontSize: 14, color: colors.slate400, marginTop: 12 },
});
