import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  Bell,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  Euro,
  Handshake,
  Image as ImageIcon,
  Package,
  Plus,
  Receipt,
  Users,
} from "lucide-react-native";
import { MobileAppBar } from "../components/MobileAppBar";
import { ContactPicker } from "../components/ContactPicker";
import { SplitSettlementCard } from "../components/SplitSettlementCard";
import { ConfirmQrCard } from "../components/ConfirmQrCard";
import { createRequest } from "../lib/api";
import type { RequestShare } from "../lib/confirm-url";
import { useAuth } from "../lib/AuthContext";
import {
  formatEur,
  isGroupScenario,
  newEntry,
  recalcAmounts,
  todayISO,
} from "../lib/request-helpers";
import { computeSettlements } from "../lib/split-settlement";
import type { Attachment, LoanType, RecipientEntry, Scenario } from "../lib/request-types";
import {
  SCENARIO_META,
  SCENARIO_ORDER,
} from "../lib/request-types";
import { colors, radius } from "../lib/theme";

const SCENARIO_ICONS = {
  loan: Handshake,
  "group-fee": Users,
  "split-bill": Receipt,
  "awaiting-share": CheckCircle2,
} as const;

function parseScenario(raw: string | string[] | undefined): Scenario {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v && SCENARIO_ORDER.includes(v as Scenario)) return v as Scenario;
  return "loan";
}

export default function NewRequestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ scenario?: string }>();
  const { user } = useAuth();

  const [scenario, setScenario] = useState<Scenario>(() => parseScenario(params.scenario));
  const [loanType, setLoanType] = useState<LoanType>("money");
  const [recipients, setRecipients] = useState<RecipientEntry[]>([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [splitEqually, setSplitEqually] = useState(true);
  const [myPaidAmount, setMyPaidAmount] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    shares: RequestShare[];
    count: number;
    totalAmount: number;
  } | null>(null);

  const multi = isGroupScenario(scenario);
  const meta = SCENARIO_META[scenario];
  const ScenarioIcon = SCENARIO_ICONS[scenario];

  const settlements = useMemo(() => {
    if (scenario !== "split-bill" && scenario !== "awaiting-share") return [];
    const parts = recipients
      .filter((r) => r.name.trim())
      .map((r) => ({ name: r.name.trim(), amount: r.amount, paidAmount: r.paidAmount || 0 }));
    const paid = parseFloat(myPaidAmount) || parseFloat(totalAmount) || 0;
    if (paid > 0) parts.push({ name: user?.firstName ?? "Aš", amount: 0, paidAmount: paid });
    return computeSettlements(parts);
  }, [scenario, recipients, myPaidAmount, totalAmount, user?.firstName]);

  function handleRecipientsChange(next: RecipientEntry[]) {
    const updated = multi && splitEqually ? recalcAmounts(next, totalAmount, true) : next;
    setRecipients(updated);
  }

  function handleTotalChange(val: string) {
    setTotalAmount(val);
    if (multi && splitEqually) setRecipients((prev) => recalcAmounts(prev, val, true));
    if (scenario === "awaiting-share" && !myPaidAmount) setMyPaidAmount(val);
  }

  async function scanReceipt(fromCamera: boolean) {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Leidimas", "Reikalinga prieiga prie kameros arba galerijos.");
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.75 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.75 });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const data = asset.base64
      ? `data:${asset.mimeType ?? "image/jpeg"};base64,${asset.base64}`
      : asset.uri;
    const att: Attachment = {
      name: asset.fileName ?? `cekis-${Date.now()}.jpg`,
      size: asset.fileSize ?? 200000,
      type: asset.mimeType ?? "image/jpeg",
      data,
    };
    setAttachments([att]);
    setReceiptPreview(asset.uri);
    Alert.alert(
      "Čekis pridėtas",
      "Suma vis dar įveskite ranka (automatinis OCR – netrukus). Nuotrauka bus prisegta prie prašymo.",
    );
  }

  async function submit() {
    setError(null);
    if (!recipients.length) {
      setError("Pridėkite bent vieną gavėją.");
      return;
    }
    for (const r of recipients) {
      if (!r.email.trim() && !r.phone.trim()) {
        setError(`Gavėjui „${r.name || "?"}" nurodykite el. paštą arba telefoną.`);
        return;
      }
      if (!r.amount || r.amount <= 0) {
        setError(`Nurodykite teigiamą sumą gavėjui „${r.name || "?"}".`);
        return;
      }
    }
    if (!dueDate) {
      setError("Nurodykite terminą (YYYY-MM-DD).");
      return;
    }
    if (!description.trim()) {
      setError("Aprašymas privalomas.");
      return;
    }
    if (!consent) {
      setError("Patvirtinkite sutikimą su sąlygomis.");
      return;
    }

    const payloadRecipients = recipients.map((r) => ({
      name: r.name.trim(),
      email: r.email.trim() || null,
      phone: r.phone.trim() || null,
      amount: r.amount,
      saveAsContact: r.saveAsContact,
    }));

    setSubmitting(true);
    try {
      const result = await createRequest({
        scenario,
        recipients: payloadRecipients,
        dueDate,
        description: description.trim(),
        itemDescription: scenario === "loan" && loanType === "item" ? itemDescription.trim() : null,
        reminderType: "7d",
        reminderDays: 7,
        attachments,
        consent: true,
      });
      setSuccess(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Klaida kuriant prašymą");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <View style={s.screen}>
        <MobileAppBar variant="back" title="Sukurta" />
        <ScrollView contentContainerStyle={s.successScroll}>
          <CheckCircle2 size={72} color={colors.green} strokeWidth={1.25} style={{ alignSelf: "center" }} />
          <Text style={s.successTitle}>
            {success.count > 1 ? `${success.count} prašymai sukurti!` : "Prašymas sukurtas!"}
          </Text>
          <Text style={s.successSub}>
            Parodykite QR kodą skolininkui — tai jo mini parašas. Taip pat išsiuntėme nuorodą el. paštu / SMS.
            {"\n"}Bendra suma: {formatEur(success.totalAmount)}
          </Text>
          {success.shares.map((share) => (
            <ConfirmQrCard
              key={share.id}
              confirmToken={share.confirmToken}
              recipientName={share.recipientName}
              compact={success.shares.length > 1}
            />
          ))}
          <TouchableOpacity style={s.primaryBtn} onPress={() => router.replace("/(tabs)")}>
            <Text style={s.primaryBtnText}>Į pradžią</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.secondaryBtn} onPress={() => router.replace({ pathname: "/new-request", params: { scenario } })}>
            <Text style={s.secondaryBtnText}>Sukurti kitą</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const descPlaceholder =
    scenario === "group-fee" ? "Renginio pavadinimas, mokestis..." :
    scenario === "split-bill" ? "Kokia sąskaita buvo padalinta..." :
    scenario === "awaiting-share" ? "Ką apmokėjote, kieno dalis..." :
    "Už ką skolinama, kontekstas...";

  return (
    <View style={s.screen}>
      <MobileAppBar variant="back" title="Naujas prašymas" />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.h1}>Naujas prašymas</Text>
        <Text style={s.sub}>Sukurk. Išsiųsk. Sistema pasirūpins.</Text>

        {/* Scenario tabs */}
        <View style={s.scenarioGrid}>
          {SCENARIO_ORDER.map((id) => {
            const on = scenario === id;
            const Icon = SCENARIO_ICONS[id];
            return (
              <TouchableOpacity
                key={id}
                style={[s.scenarioTile, on && s.scenarioTileOn]}
                onPress={() => setScenario(id)}
                activeOpacity={0.85}
              >
                {on && (
                  <View style={s.scenarioCheck}>
                    <Check size={10} color="#fff" strokeWidth={3} />
                  </View>
                )}
                <Icon size={20} color={colors.navy} strokeWidth={1.8} />
                <Text style={s.scenarioLbl}>{SCENARIO_META[id].quickLabel}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={s.badge}>
          <ScenarioIcon size={18} color={colors.navy} />
          <View style={{ flex: 1 }}>
            <Text style={s.badgeTitle}>{meta.label}</Text>
            <Text style={s.badgeSub}>{meta.sublabel}</Text>
          </View>
        </View>

        {/* Split-bill: receipt */}
        {scenario === "split-bill" && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Čekio skenavimas</Text>
            <Text style={s.sectionHint}>
              Nufotografuokite čekį – sumą įveskite žemiau. Sistema perskaičiuos, kas kam kiek skolingas pagal tai, kas ką apmokėjo.
            </Text>
            <View style={s.scanRow}>
              <TouchableOpacity style={s.scanBtn} onPress={() => scanReceipt(true)}>
                <Camera size={18} color={colors.navy} />
                <Text style={s.scanBtnText}>Kamera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.scanBtn} onPress={() => scanReceipt(false)}>
                <ImageIcon size={18} color={colors.navy} />
                <Text style={s.scanBtnText}>Galerija</Text>
              </TouchableOpacity>
            </View>
            {receiptPreview && (
              <Image source={{ uri: receiptPreview }} style={s.receiptImg} resizeMode="cover" />
            )}
          </View>
        )}

        {/* Recipients */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>{multi ? "Gavėjai" : "Gavėjas"}</Text>
          {scenario === "loan" && (
            <View style={s.toggleRow}>
              {(["money", "item"] as LoanType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[s.toggle, loanType === t && s.toggleOn]}
                  onPress={() => setLoanType(t)}
                >
                  {t === "money" ? <Euro size={16} color={colors.navy} /> : <Package size={16} color={colors.navy} />}
                  <Text style={[s.toggleText, loanType === t && s.toggleTextOn]}>
                    {t === "money" ? "Pinigai" : "Daiktas"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <ContactPicker
            entries={recipients}
            multiple={multi}
            showAmount={multi && !splitEqually}
            showPaid={scenario === "split-bill"}
            onChange={handleRecipientsChange}
          />
        </View>

        {/* Amount */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            <Euro size={16} color={colors.green} />{" "}
            {scenario === "loan" && loanType === "item" ? "Daikto aprašymas" : "Suma ir terminas"}
          </Text>

          {scenario === "loan" && loanType === "item" && (
            <>
              <Text style={s.lbl}>Daikto pavadinimas *</Text>
              <TextInput
                style={s.input}
                value={itemDescription}
                onChangeText={setItemDescription}
                placeholder="pvz.: Gitara, Fotoaparatas..."
                placeholderTextColor={colors.slate300}
              />
            </>
          )}

          {!(scenario === "loan" && loanType === "item") && !multi && (
            <>
              <Text style={s.lbl}>Suma (€) *</Text>
              <TextInput
                style={s.input}
                value={recipients[0]?.amount ? String(recipients[0].amount) : ""}
                onChangeText={(v) => {
                  const amount = parseFloat(v) || 0;
                  setRecipients((prev) =>
                    prev.length
                      ? [{ ...prev[0], amount }]
                      : [newEntry({ amount })],
                  );
                }}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.slate300}
              />
            </>
          )}

          {multi && (
            <>
              <Text style={s.lbl}>
                {scenario === "group-fee" ? "Suma vienam arba bendra (€) *" : "Bendra suma (€) *"}
              </Text>
              <TextInput
                style={s.input}
                value={totalAmount}
                onChangeText={handleTotalChange}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.slate300}
              />
              <View style={s.toggleRow}>
                <TouchableOpacity
                  style={[s.toggle, splitEqually && s.toggleOn]}
                  onPress={() => {
                    setSplitEqually(true);
                    setRecipients((prev) => recalcAmounts(prev, totalAmount, true));
                  }}
                >
                  <Text style={[s.toggleText, splitEqually && s.toggleTextOn]}>Lygiomis dalimis</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.toggle, !splitEqually && s.toggleOn]}
                  onPress={() => setSplitEqually(false)}
                >
                  <Text style={[s.toggleText, !splitEqually && s.toggleTextOn]}>Kiekvienam atskirai</Text>
                </TouchableOpacity>
              </View>
              {splitEqually && recipients.length > 0 && totalAmount ? (
                <Text style={s.hint}>
                  Kiekvienam: {formatEur(parseFloat(totalAmount) / recipients.length)} ({recipients.length} asmenys)
                </Text>
              ) : null}
            </>
          )}

          {(scenario === "awaiting-share" || scenario === "split-bill") && (
            <>
              <Text style={s.lbl}>
                {scenario === "awaiting-share" ? "Kiek jūs sumokėjote (€)" : "Jūsų sumokėta suma (€)"}
              </Text>
              <TextInput
                style={s.input}
                value={myPaidAmount}
                onChangeText={setMyPaidAmount}
                keyboardType="decimal-pad"
                placeholder={totalAmount || "0.00"}
                placeholderTextColor={colors.slate300}
              />
            </>
          )}

          <Text style={s.lbl}>Terminas (YYYY-MM-DD) *</Text>
          <View style={s.inputRow}>
            <Calendar size={18} color={colors.slate400} />
            <TextInput
              style={[s.input, { flex: 1, borderWidth: 0, paddingHorizontal: 0 }]}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder={todayISO()}
              placeholderTextColor={colors.slate300}
            />
          </View>

          <Text style={s.lbl}>Aprašymas *</Text>
          <TextInput
            style={[s.input, s.textarea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholder={descPlaceholder}
            placeholderTextColor={colors.slate300}
          />
        </View>

        {(scenario === "split-bill" || scenario === "awaiting-share") && recipients.length > 0 && (
          <SplitSettlementCard lines={settlements} />
        )}

        {/* Info */}
        <View style={s.infoBox}>
          <Bell size={20} color={colors.green} />
          <View style={{ flex: 1 }}>
            <Text style={s.infoTitle}>Sistema pasirūpins.</Text>
            <Text style={s.infoSub}>
              {scenario === "split-bill"
                ? "Kiekvienas gavėjas gaus prašymą su savo dalimi. Tarpusavio skolų lentelė rodo optimizuotus pavedimus."
                : scenario === "group-fee"
                ? "Visi gavėjai gaus atskirus prašymus – patogu masiniam surinkimui."
                : scenario === "awaiting-share"
                ? "Jūs apmokėjote – kiti gaus prašymą grąžinti dalį. Priminti – kiekviename įraše."
                : "Prašymą išsiųsime gavėjui. Priminti galėsite prašymo kortelėje."}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={s.checkRow} onPress={() => setConsent(!consent)} activeOpacity={0.8}>
          <View style={[s.checkbox, consent && s.checkboxOn]}>
            {consent && <Text style={s.checkMark}>✓</Text>}
          </View>
          <Text style={s.consent}>
            Patvirtinu, kad informacija teisinga. Sutinku, kad gavėjams būtų siunčiami pranešimai ir priminimai.
          </Text>
        </TouchableOpacity>

        {error && <Text style={s.error}>{error}</Text>}

        <TouchableOpacity
          style={[s.submit, submitting && { opacity: 0.6 }]}
          onPress={submit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Plus size={20} color="#fff" />
              <Text style={s.submitText}>
                {multi && recipients.length > 1
                  ? `Sukurti ${recipients.length} prašymus`
                  : "Sukurti prašymą"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: 16, paddingBottom: 40 },
  h1: { fontSize: 22, fontWeight: "700", color: colors.navy },
  sub: { fontSize: 14, color: colors.slate500, marginTop: 4, marginBottom: 16 },
  scenarioGrid: { flexDirection: "row", gap: 8, marginBottom: 16 },
  scenarioTile: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    padding: 10,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
  },
  scenarioTileOn: { borderColor: colors.navy },
  scenarioCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  scenarioLbl: { fontSize: 10, fontWeight: "600", color: colors.navy, textAlign: "center" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate200,
    marginBottom: 16,
  },
  badgeTitle: { fontSize: 14, fontWeight: "600", color: colors.navy },
  badgeSub: { fontSize: 12, color: colors.slate400, marginTop: 2 },
  section: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate200,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: colors.navy, marginBottom: 10 },
  sectionHint: { fontSize: 12, color: colors.slate500, lineHeight: 18, marginBottom: 10 },
  scanRow: { flexDirection: "row", gap: 10 },
  scanBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.slate50,
  },
  scanBtnText: { fontSize: 13, fontWeight: "600", color: colors.navy },
  receiptImg: { width: "100%", height: 140, borderRadius: radius.md, marginTop: 12 },
  lbl: { fontSize: 13, fontWeight: "500", color: colors.slate600, marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.navy,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingHorizontal: 12,
  },
  textarea: { minHeight: 80, textAlignVertical: "top" },
  hint: { fontSize: 12, color: colors.slate500, marginTop: 8 },
  toggleRow: { flexDirection: "row", gap: 8, marginTop: 8, flexWrap: "wrap" },
  toggle: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate200,
  },
  toggleOn: { borderColor: colors.green, backgroundColor: colors.green50 },
  toggleText: { fontSize: 12, fontWeight: "500", color: colors.slate600 },
  toggleTextOn: { color: colors.green },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate200,
    marginBottom: 8,
  },
  radioRowOn: { borderColor: colors.green, backgroundColor: colors.green50 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.slate300 },
  radioOn: { borderColor: colors.green, backgroundColor: colors.green },
  radioLbl: { fontSize: 14, color: colors.navy },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.green50,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 16,
  },
  infoTitle: { fontSize: 14, fontWeight: "600", color: colors.navy },
  infoSub: { fontSize: 12, color: colors.slate600, marginTop: 4, lineHeight: 18 },
  checkRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.slate300,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxOn: { backgroundColor: colors.green, borderColor: colors.green },
  checkMark: { color: "#fff", fontSize: 12, fontWeight: "700" },
  consent: { flex: 1, fontSize: 13, color: colors.slate600, lineHeight: 20 },
  error: { color: colors.red500, fontSize: 14, marginBottom: 12 },
  submit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    paddingVertical: 16,
  },
  submitText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  successScroll: { padding: 24, paddingBottom: 40 },
  success: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  successTitle: { fontSize: 22, fontWeight: "700", color: colors.navy, marginTop: 16, textAlign: "center" },
  successSub: { fontSize: 14, color: colors.slate600, marginTop: 8, textAlign: "center", lineHeight: 22 },
  primaryBtn: {
    marginTop: 24,
    backgroundColor: colors.navy,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: radius.lg,
    width: "100%",
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "600" },
  secondaryBtn: {
    marginTop: 12,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.lg,
  },
  secondaryBtnText: { color: colors.slate600, fontWeight: "600" },
});
