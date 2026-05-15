import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MobileAppBar } from "../../../components/MobileAppBar";
import { getRequest, updateRequest } from "../../../lib/api";
import type { DashRequest } from "../../../lib/types";
import { colors, radius } from "../../../lib/theme";

export default function EditRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const req: DashRequest = await getRequest(id);
      setName(req.recipientName);
      setPhone(req.recipientPhone ?? "");
      setEmail(req.recipientEmail ?? "");
      setAmount(String(req.amount));
      setDueDate(req.dueDate.split("T")[0] ?? "");
      setDescription(req.description);
      setItemDescription(req.itemDescription ?? "");
    } catch {
      Alert.alert("Klaida", "Nepavyko užkrauti prašymo");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!id) return;
    if (!name.trim()) {
      Alert.alert("Klaida", "Vardas privalomas");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      Alert.alert("Klaida", "Nurodykite telefoną arba el. paštą");
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert("Klaida", "Netinkama suma");
      return;
    }
    setSaving(true);
    try {
      await updateRequest(id, {
        recipientName: name.trim(),
        recipientPhone: phone.trim() || null,
        recipientEmail: email.trim() || null,
        amount: amt,
        dueDate,
        description: description.trim(),
        itemDescription: itemDescription.trim() || null,
      });
      router.replace(`/request/${id}` as never);
    } catch (e) {
      Alert.alert("Klaida", e instanceof Error ? e.message : "Nepavyko išsaugoti");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <MobileAppBar variant="back" title="Koreguoti prašymą" />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <Text style={s.lbl}>Gavėjo vardas *</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} />

        <Text style={s.lbl}>Telefonas</Text>
        <TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={s.lbl}>El. paštas</Text>
        <TextInput
          style={s.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={s.lbl}>Suma (€) *</Text>
        <TextInput style={s.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />

        <Text style={s.lbl}>Terminas (YYYY-MM-DD) *</Text>
        <TextInput style={s.input} value={dueDate} onChangeText={setDueDate} />

        <Text style={s.lbl}>Aprašymas *</Text>
        <TextInput style={[s.input, s.area]} value={description} onChangeText={setDescription} multiline />

        <Text style={s.lbl}>Daikto aprašymas</Text>
        <TextInput style={s.input} value={itemDescription} onChangeText={setItemDescription} />

        <TouchableOpacity style={s.saveBtn} onPress={save} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.saveText}>Išsaugoti pakeitimus</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  lbl: { fontSize: 13, fontWeight: "500", color: colors.slate600, marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.navy,
  },
  area: { minHeight: 80, textAlignVertical: "top" },
  saveBtn: {
    marginTop: 24,
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
