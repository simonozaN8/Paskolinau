import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  Edit3,
  Eye,
  Hash,
  Mail,
  Phone,
  Trash2,
  User,
} from "lucide-react-native";
import { MobileAppBar } from "../../components/MobileAppBar";
import { StatusBadge } from "../../components/StatusBadge";
import { deleteRequest, getRequest, patchRequestStatus } from "../../lib/api";
import { sendReminder } from "../../lib/remind";
import { isPaidStatus } from "../../lib/request-groups";
import { SCENARIO_META } from "../../lib/request-types";
import type { DashRequest } from "../../lib/types";
import { formatDate, formatDateTime, formatMoney } from "../../lib/constants";
import { colors, radius } from "../../lib/theme";

const SCENARIO_LABELS: Record<string, string> = {
  loan: "Paskolinau",
  "group-fee": "Surenku",
  "split-bill": "Padalinau",
  "awaiting-share": "Apmokėjau",
};

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [req, setReq] = useState<DashRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      setReq(await getRequest(id));
    } catch {
      setReq(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function onRemind() {
    if (!req) return;
    setActing(true);
    try {
      await sendReminder(req.recipientName, req.id);
      await load();
    } catch (e) {
      Alert.alert("Klaida", e instanceof Error ? e.message : "Nepavyko išsiųsti");
    } finally {
      setActing(false);
    }
  }

  async function onComplete() {
    if (!req) return;
    setActing(true);
    try {
      await patchRequestStatus(req.id, "complete");
      await load();
    } catch (e) {
      Alert.alert("Klaida", e instanceof Error ? e.message : "Nepavyko patvirtinti");
    } finally {
      setActing(false);
    }
  }

  function onDelete() {
    if (!req) return;
    Alert.alert("Ištrinti prašymą?", "Šio veiksmo atšaukti negalima.", [
      { text: "Atšaukti", style: "cancel" },
      {
        text: "Ištrinti",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteRequest(req.id);
            router.replace("/(tabs)/history");
          } catch (e) {
            Alert.alert("Klaida", e instanceof Error ? e.message : "Nepavyko ištrinti");
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  if (!req) {
    return (
      <View style={s.centered}>
        <Text style={s.err}>Prašymas nerastas</Text>
      </View>
    );
  }

  const title = req.itemDescription ?? req.description;
  const scenarioLabel = SCENARIO_META[req.scenario as keyof typeof SCENARIO_META]?.label
    ?? SCENARIO_LABELS[req.scenario]
    ?? req.scenario;

  const steps = [
    { label: "Sukurta", done: true, date: req.createdAt, sub: "Prašymas užregistruotas" },
    {
      label: "Išsiųsta",
      done: true,
      date: req.createdAt,
      sub: `Pranešimas ${req.recipientName}`,
    },
    {
      label: "Peržiūrėta",
      done: !!req.confirmedAt,
      date: req.confirmedAt,
      sub: req.confirmedAt ? "Gavėjas atidarė nuorodą" : "Laukia",
    },
    {
      label: "Apmokėjau",
      done: !!req.paidAt,
      date: req.paidAt,
      sub: req.paidAt ? "Gavėjas pažymėjo apmokėjimą" : "Laukia patvirtinimo",
    },
    {
      label: "Gavau",
      done: !!req.completedAt,
      date: req.completedAt,
      sub: req.completedAt ? "Patvirtinta" : "Patvirtinkite gavimą",
    },
  ];

  const canRemind = ["active", "confirmed", "reminded"].includes(req.status);
  const canComplete = req.status === "paid";

  return (
    <View style={s.screen}>
      <MobileAppBar variant="back" title="Mokėjimo prašymas" />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.card}>
          <View style={s.cardHead}>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{title}</Text>
              <Text style={s.cardSub}>Kam: {req.recipientName}</Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 6 }}>
              <Text style={s.amount}>{formatMoney(req.amount)}</Text>
              <StatusBadge status={req.status} />
            </View>
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.sectionTitle}>Registracijos informacija</Text>
          <InfoRow icon={<User size={16} color={colors.slate400} />} label="Gavėjas" value={req.recipientName} />
          <InfoRow icon={<Phone size={16} color={colors.slate400} />} label="Telefonas" value={req.recipientPhone ?? "—"} />
          <InfoRow icon={<Mail size={16} color={colors.slate400} />} label="El. paštas" value={req.recipientEmail ?? "—"} />
          <InfoRow icon={<Calendar size={16} color={colors.slate400} />} label="Terminas" value={formatDate(req.dueDate)} />
          <InfoRow icon={<CreditCard size={16} color={colors.slate400} />} label="Tipas" value={scenarioLabel} />
          <InfoRow icon={<Hash size={16} color={colors.slate400} />} label="ID" value={`#${req.id.slice(0, 12)}`} />
          {req.description ? (
            <View style={s.descBox}>
              <Text style={s.descLbl}>Aprašymas</Text>
              <Text style={s.descVal}>{req.description}</Text>
            </View>
          ) : null}
        </View>

        <View style={s.card}>
          <Text style={s.sectionTitle}>Prašymo būsena</Text>
          {steps.map((step) => (
            <View key={step.label} style={s.step}>
              <View style={[s.stepDot, step.done && s.stepDotDone]}>
                {step.done ? <Check size={12} color="#fff" strokeWidth={3} /> : <Eye size={10} color={colors.slate400} />}
              </View>
              <View style={s.stepBody}>
                <Text style={s.stepLabel}>{step.label}</Text>
                <Text style={s.stepSub}>{step.sub}</Text>
                {step.date ? <Text style={s.stepDate}>{formatDateTime(step.date)}</Text> : null}
              </View>
            </View>
          ))}
        </View>

        <View style={s.actions}>
          {canRemind && (
            <TouchableOpacity style={s.btnOutline} onPress={onRemind} disabled={acting}>
              <Bell size={18} color={colors.navy} />
              <Text style={s.btnOutlineText}>{acting ? "Siunčiama…" : "Priminti"}</Text>
            </TouchableOpacity>
          )}
          {canComplete && (
            <TouchableOpacity style={s.btnPrimary} onPress={onComplete} disabled={acting}>
              <CheckCircle2 size={18} color="#fff" />
              <Text style={s.btnPrimaryText}>Patvirtinti gavimą</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={s.secondaryActions}>
          <TouchableOpacity
            style={s.btnSecondary}
            onPress={() => router.push(`/request/edit/${req.id}` as never)}
          >
            <Edit3 size={16} color={colors.navy} />
            <Text style={s.btnSecondaryText}>Koreguoti</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btnSecondary, s.btnDanger]} onPress={onDelete}>
            <Trash2 size={16} color={colors.red500} />
            <Text style={[s.btnSecondaryText, { color: colors.red500 }]}>Ištrinti</Text>
          </TouchableOpacity>
        </View>

        {isPaidStatus(req.status) && req.status !== "completed" && (
          <Text style={s.hint}>
            Gavėjas pažymėjo „Apmokėjau“ – patikrinkite sąskaitą ir patvirtinkite gavimą.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={s.infoRow}>
      {icon}
      <Text style={s.infoLbl}>{label}</Text>
      <Text style={s.infoVal} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.gray50 },
  scroll: { padding: 16, paddingBottom: 32 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  err: { fontSize: 16, color: colors.slate500 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: 16,
    marginBottom: 12,
  },
  cardHead: { flexDirection: "row", gap: 12 },
  cardTitle: { fontSize: 17, fontWeight: "700", color: colors.navy },
  cardSub: { fontSize: 13, color: colors.slate500, marginTop: 4 },
  amount: { fontSize: 17, fontWeight: "700", color: colors.navy },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: colors.navy, marginBottom: 12 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.slate100,
  },
  infoLbl: { width: 88, fontSize: 13, color: colors.slate500 },
  infoVal: { flex: 1, fontSize: 13, fontWeight: "500", color: colors.navy, textAlign: "right" },
  descBox: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.slate100 },
  descLbl: { fontSize: 12, color: colors.slate500, marginBottom: 4 },
  descVal: { fontSize: 14, color: colors.navy, lineHeight: 20 },
  step: { flexDirection: "row", gap: 12, marginBottom: 14 },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.slate200,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotDone: { backgroundColor: colors.green, borderColor: colors.green },
  stepBody: { flex: 1 },
  stepLabel: { fontSize: 14, fontWeight: "600", color: colors.navy },
  stepSub: { fontSize: 12, color: colors.slate500, marginTop: 2 },
  stepDate: { fontSize: 11, color: colors.slate400, marginTop: 2 },
  actions: { flexDirection: "row", gap: 10, marginTop: 4 },
  btnOutline: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
  },
  btnOutlineText: { fontSize: 14, fontWeight: "600", color: colors.navy },
  btnPrimary: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.green,
  },
  btnPrimaryText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  secondaryActions: { flexDirection: "row", gap: 10, marginTop: 12 },
  btnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
  },
  btnDanger: { borderColor: "#FECACA" },
  btnSecondaryText: { fontSize: 13, fontWeight: "600", color: colors.navy },
  hint: {
    fontSize: 12,
    color: colors.slate500,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
    fontStyle: "italic",
  },
});
