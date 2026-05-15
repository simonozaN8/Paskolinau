import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator, Alert,
} from "react-native";
import { router } from "expo-router";
import { ArrowRight, Check } from "lucide-react-native";
import { registerUser, sendCode, mobileLogin } from "../../lib/api";
import { useAuth } from "../../lib/AuthContext";
import { colors, radius } from "../../lib/theme";

const logo = require("../../assets/icon.png");

type Step = "form" | "verify";

export default function RegisterScreen() {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "", bankAccount: "",
  });
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleRegister() {
    const { firstName, lastName, phone, email, bankAccount } = form;
    if (!firstName || !lastName || !phone || !email || !bankAccount) {
      Alert.alert("Klaida", "Užpildykite visus laukus");
      return;
    }
    setLoading(true);
    try {
      await registerUser({
        firstName, lastName, phone, email: email.trim().toLowerCase(), bankAccount,
      });
      const res = await sendCode(email.trim().toLowerCase());
      if (res.dev) setDevCode(res.dev);
      setStep("verify");
    } catch (e: unknown) {
      Alert.alert("Klaida", e instanceof Error ? e.message : "Registracija nepavyko");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (code.length < 4) {
      Alert.alert("Klaida", "Įveskite kodą");
      return;
    }
    setLoading(true);
    try {
      const res = await mobileLogin(form.email.trim().toLowerCase(), code.trim());
      await login(res.token, res.user);
      router.replace("/(tabs)");
    } catch (e: unknown) {
      Alert.alert("Klaida", e instanceof Error ? e.message : "Neteisingas kodas");
    } finally {
      setLoading(false);
    }
  }

  const Field = ({
    label, value, onChangeText, keyboardType,
  }: {
    label: string; value: string; onChangeText: (v: string) => void; keyboardType?: "default" | "email-address" | "phone-pad";
  }) => (
    <View style={s.field}>
      <Text style={s.fieldLbl}>{label}</Text>
      <TextInput
        style={s.fieldInput}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
        placeholderTextColor={colors.slate400}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.logoWrap}>
          <Image source={logo} style={s.logoSm} />
          <Text style={s.brand}>
            Paskolinau<Text style={s.brandGreen}>.lt</Text>
          </Text>
          <Text style={s.tagline}>Sukurk. Išsiųsk. Sistema pasirūpins.</Text>
        </View>

        {step === "form" ? (
          <View style={s.card}>
            <Text style={s.cardTitle}>Sukurti paskyrą</Text>
            <Text style={s.cardSub}>Užpildykite visus laukus registracijai.</Text>
            <View style={s.nameRow}>
              <View style={{ flex: 1 }}>
                <Field label="Vardas" value={form.firstName} onChangeText={set("firstName")} />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Pavardė" value={form.lastName} onChangeText={set("lastName")} />
              </View>
            </View>
            <Field label="Telefono numeris" value={form.phone} onChangeText={set("phone")} keyboardType="phone-pad" />
            <Field label="El. paštas" value={form.email} onChangeText={set("email")} keyboardType="email-address" />
            <Field label="Banko sąskaita (IBAN)" value={form.bankAccount} onChangeText={set("bankAccount")} />
            <TouchableOpacity style={s.btn} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <View style={s.btnInner}>
                  <Text style={s.btnText}>Registruotis</Text>
                  <ArrowRight size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.card}>
            <View style={s.verifyIcon}>
              <Check size={24} color={colors.green} />
            </View>
            <Text style={s.cardTitle}>El. pašto patvirtinimas</Text>
            <Text style={s.cardSub}>Kodas išsiųstas į {form.email}</Text>
            {devCode !== "" && (
              <View style={s.devBox}>
                <Text style={s.devLbl}>Kūrimo režimas — jūsų kodas:</Text>
                <Text style={s.devCode}>{devCode}</Text>
              </View>
            )}
            <TextInput
              style={s.codeInput}
              placeholder="000000"
              placeholderTextColor={colors.slate400}
              keyboardType="number-pad"
              maxLength={6}
              value={code}
              onChangeText={setCode}
              autoFocus
            />
            <TouchableOpacity style={[s.btn, { backgroundColor: colors.green }]} onPress={handleVerify} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <Text style={s.btnText}>Patvirtinti ir prisijungti</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={() => router.back()} style={s.back}>
          <Text style={s.backText}>← Grįžti į prisijungimą</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40 },
  logoWrap: { alignItems: "center", paddingTop: 48, paddingBottom: 24 },
  logoSm: { width: 56, height: 56 },
  brand: { marginTop: 12, fontSize: 20, fontWeight: "700", color: colors.navy },
  brandGreen: { color: colors.green },
  tagline: { fontSize: 12, color: colors.slate500, marginTop: 4 },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.navy },
  cardSub: { fontSize: 14, color: colors.slate500, marginTop: 4, marginBottom: 16 },
  nameRow: { flexDirection: "row", gap: 12 },
  field: { marginBottom: 12 },
  fieldLbl: { fontSize: 12, fontWeight: "600", color: colors.slate500, marginBottom: 4 },
  fieldInput: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.navy,
  },
  btn: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  btnInner: { flexDirection: "row", gap: 8, alignItems: "center" },
  btnText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  verifyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.emerald50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 12,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 8,
    paddingVertical: 14,
    marginBottom: 16,
    color: colors.navy,
  },
  devBox: { backgroundColor: colors.amber50, borderRadius: radius.md, padding: 12, marginBottom: 16, alignItems: "center" },
  devLbl: { fontSize: 12, color: colors.amber700 },
  devCode: { fontSize: 30, fontWeight: "800", letterSpacing: 6, color: colors.amber900, marginTop: 4 },
  back: { marginTop: 16, alignItems: "center" },
  backText: { fontSize: 12, color: colors.slate400 },
});
