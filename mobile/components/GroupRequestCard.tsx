import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  Handshake,
  Receipt,
  Timer,
  Users,
} from "lucide-react-native";
import type { DashRequest } from "../lib/types";
import { isPaidStatus } from "../lib/request-groups";
import { formatDate, formatMoney } from "../lib/constants";
import { STATUS_LABELS, STATUS_STYLES } from "../lib/constants";
import { patchRequestStatus } from "../lib/api";
import { sendReminder } from "../lib/remind";
import { colors, radius } from "../lib/theme";

const SCENARIO_LABELS: Record<string, string> = {
  loan: "Paskolinau",
  "group-fee": "Surenku",
  "split-bill": "Padalinau",
  "awaiting-share": "Primenu",
};

type Props = {
  requests: DashRequest[];
  onRefresh: () => void;
};

function ScenarioIcon({ scenario }: { scenario: string }) {
  const p = { size: 20, color: colors.navy };
  switch (scenario) {
    case "group-fee":
      return <Users {...p} />;
    case "split-bill":
      return <Receipt {...p} />;
    case "awaiting-share":
      return <Timer {...p} />;
    default:
      return <Handshake {...p} />;
  }
}

function needsPayment(status: string) {
  return ["active", "confirmed", "reminded"].includes(status);
}

export function GroupRequestCard({ requests, onRefresh }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  const unpaid = requests.filter((r) => needsPayment(r.status));
  const settled = requests.filter((r) => !needsPayment(r.status));

  const first = requests[0];
  const total = requests.length;
  const paidN = requests.filter((r) => isPaidStatus(r.status)).length;
  const pct = total ? Math.round((paidN / total) * 100) : 0;
  const allDone = paidN === total;
  const totalAmt = requests.reduce((s, r) => s + Number(r.amount), 0);
  const collectingFor = first.description?.trim() || SCENARIO_LABELS[first.scenario] || "Grupinis rinkimas";

  const badgeLabel = allDone
    ? STATUS_LABELS.completed
    : paidN > 0
    ? `${paidN}/${total} apmokėjo`
    : STATUS_LABELS.active;
  const badgeStyle = allDone
    ? STATUS_STYLES.completed
    : paidN > 0
    ? { bg: colors.amber50, text: colors.amber700 }
    : STATUS_STYLES.active;

  async function patch(id: string, action: "complete" | "cancel") {
    setActing(`${id}-${action}`);
    try {
      await patchRequestStatus(id, action);
      onRefresh();
    } catch (e) {
      Alert.alert("Klaida", e instanceof Error ? e.message : "Nepavyko");
    } finally {
      setActing(null);
    }
  }

  async function remindMember(r: DashRequest) {
    setActing(`${r.id}-remind`);
    try {
      await sendReminder(r.recipientName, r.id);
      onRefresh();
    } catch (e) {
      Alert.alert("Klaida", e instanceof Error ? e.message : "Nepavyko išsiųsti priminimo");
    } finally {
      setActing(null);
    }
  }

  function renderMember(r: DashRequest, showRemind: boolean) {
    const st = STATUS_STYLES[r.status] ?? STATUS_STYLES.active;
    const dateAt = r.completedAt ?? r.paidAt ?? r.confirmedAt;
    const busy = acting?.startsWith(r.id);

    return (
      <TouchableOpacity
        key={r.id}
        style={s.memberRow}
        onPress={() => router.push(`/request/${r.id}` as never)}
        activeOpacity={0.85}
      >
        <View style={s.memberTop}>
          <View style={s.memberNameRow}>
            {isPaidStatus(r.status) && <CheckCircle2 size={14} color={colors.green} />}
            <Text style={s.memberName}>{r.recipientName}</Text>
          </View>
          <Text style={s.memberAmount}>{formatMoney(r.amount)}</Text>
        </View>

        <View style={s.memberBottom}>
          <View style={[s.badge, { backgroundColor: st.bg }]}>
            <Text style={[s.badgeText, { color: st.text }]}>
              {STATUS_LABELS[r.status] ?? "Laukia"}
            </Text>
          </View>
          <Text style={s.memberDate}>{dateAt ? formatDate(dateAt) : "—"}</Text>
        </View>

        <View style={s.actions}>
          {r.status === "paid" && (
            <TouchableOpacity
              style={s.actionPrimary}
              disabled={!!busy}
              onPress={() => patch(r.id, "complete")}
            >
              {busy ? (
                <ActivityIndicator size="small" color={colors.green} />
              ) : (
                <Text style={s.actionPrimaryText}>Patvirtinti gavimą ✓</Text>
              )}
            </TouchableOpacity>
          )}
          {showRemind && needsPayment(r.status) && (
            <TouchableOpacity
              style={s.actionSecondary}
              disabled={!!busy}
              onPress={() => remindMember(r)}
            >
              <Bell size={12} color={colors.slate600} />
              <Text style={s.actionSecondaryText}>
                {acting === `${r.id}-remind` ? "Siunčiama…" : "Priminti"}
              </Text>
            </TouchableOpacity>
          )}
          {r.status === "completed" && <Text style={s.doneText}>✓ Įvykdyta</Text>}
          {r.status === "cancelled" && <Text style={s.cancelledText}>Atšaukta</Text>}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={s.card}>
      <TouchableOpacity style={s.header} onPress={() => setOpen((v) => !v)} activeOpacity={0.85}>
        <View style={s.iconWrap}>
          <ScenarioIcon scenario={first.scenario} />
        </View>

        <View style={s.headerBody}>
          <View style={s.titleRow}>
            <Text style={s.title} numberOfLines={2}>
              {collectingFor}
            </Text>
            <View style={[s.badge, { backgroundColor: badgeStyle.bg }]}>
              <Text style={[s.badgeText, { color: badgeStyle.text }]}>{badgeLabel}</Text>
            </View>
          </View>

          <Text style={s.sub} numberOfLines={2}>
            Renkama iš: {requests.map((r) => r.recipientName).join(", ")}
          </Text>

          <View style={s.metaRow}>
            <Text style={s.meta}>{formatMoney(totalAmt)} iš viso</Text>
            <Text style={s.meta}>·</Text>
            <Text style={s.meta}>{total} {total === 1 ? "narys" : "nariai"}</Text>
            <Text style={s.meta}>·</Text>
            <Clock size={12} color={colors.slate400} />
            <Text style={s.meta}> iki {formatDate(first.dueDate)}</Text>
          </View>

          <View style={s.progressHead}>
            <Text style={s.progressLbl}>{paidN}/{total} apmokėjo</Text>
            <Text style={[s.progressPct, allDone && { color: colors.green }]}>{pct}%</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${pct}%` }, allDone && s.progressDone]} />
          </View>
        </View>

        <ChevronDown
          size={18}
          color={colors.slate400}
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {open && (
        <View style={s.members}>
          {unpaid.length > 0 ? (
            <>
              <Text style={s.sectionLbl}>Nesumokėjo ({unpaid.length})</Text>
              {unpaid.map((r) => renderMember(r, true))}
            </>
          ) : (
            <Text style={s.allPaid}>Visi nariai apmokėjo ✓</Text>
          )}
          {settled.length > 0 && (
            <>
              <Text style={[s.sectionLbl, { marginTop: 12 }]}>Apmokėjo / užbaigta</Text>
              {settled.map((r) => renderMember(r, false))}
            </>
          )}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.slate50,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBody: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 },
  title: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.navy },
  badge: { borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: "600" },
  sub: { fontSize: 12, color: colors.slate500, marginTop: 6, lineHeight: 17 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 4, marginTop: 8 },
  meta: { fontSize: 11, color: colors.slate500 },
  progressHead: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  progressLbl: { fontSize: 10, color: colors.slate400 },
  progressPct: { fontSize: 10, color: colors.slate400, fontWeight: "600" },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.slate100,
    marginTop: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "rgba(0,200,83,0.7)", borderRadius: 3 },
  progressDone: { backgroundColor: colors.green },
  members: { borderTopWidth: 1, borderTopColor: colors.slate100, padding: 12, gap: 10 },
  sectionLbl: { fontSize: 12, fontWeight: "700", color: colors.navy, marginBottom: 8 },
  allPaid: { fontSize: 13, color: colors.green, fontWeight: "600", textAlign: "center", paddingVertical: 8 },
  memberRow: {
    borderRadius: radius.md,
    backgroundColor: colors.slate50,
    padding: 12,
    gap: 6,
  },
  memberTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  memberNameRow: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  memberName: { fontSize: 14, fontWeight: "600", color: colors.navy },
  memberAmount: { fontSize: 14, fontWeight: "700", color: colors.navy },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  itemText: { fontSize: 11, color: colors.slate400 },
  memberBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  memberDate: { fontSize: 11, color: colors.slate400 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  actionPrimary: {
    backgroundColor: colors.green50,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  actionPrimaryText: { fontSize: 11, fontWeight: "600", color: "#007a32" },
  actionSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.slate200,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  actionSecondaryText: { fontSize: 11, fontWeight: "600", color: colors.slate600 },
  doneText: { fontSize: 11, fontWeight: "600", color: colors.green },
  cancelledText: { fontSize: 11, color: colors.slate400 },
});
