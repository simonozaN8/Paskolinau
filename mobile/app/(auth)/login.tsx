import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Image, ActivityIndicator, Alert,
} from "react-native";
import { router } from "expo-router";
import { ArrowRight, KeyRound, Mail, RefreshCw } from "lucide-react-native";
import { sendCode, mobileLogin } from "../../lib/api";
import { useAuth } from "../../lib/AuthContext";
import { colors, radius } from "../../lib/theme";

const logo = require("../../assets/icon.png");

export default function LoginScreen() {
  const { login } = useAuth();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await sendCode(email.trim().toLowerCase());
      if (res.dev) setDevCode(res.dev);
      setStep("code");
    } catch (e: unknown) {
      Alert.alert("Klaida", e instanceof Error ? e.message : "Nepavyko išsiųsti kodo");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setLoading(true);
    try {
      const res = await mobileLogin(email.trim().toLowerCase(), code.trim());
      await login(res.token, res.user);
      router.replace("/(tabs)");
    } catch (e: unknown) {
      Alert.alert("Klaida", e instanceof Error ? e.message : "Neteisingas kodas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.logoWrap}>
          <Image source={logo} style={s.logo} />
          <Text style={s.brand}>
            Paskolinau<Text style={s.brandGreen}>.lt</Text>
          </Text>
          <Text style={s.tagline}>Sukurk. Išsiųsk. Sistema pasirūpins.</Text>
        </View>

        <View style={s.card}>
          {step === "email" ? (
            <>
              <Text style={s.cardTitle}>Prisijungti</Text>
              <Text style={s.cardSub}>Įveskite el. paštą – atsiųsime prisijungimo kodą.</Text>
              <View style={s.inputWrap}>
                <Mail size={16} color={colors.slate400} style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  placeholder="vardas@pastas.lt"
                  placeholderTextColor={colors.slate400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <TouchableOpacity style={s.btn} onPress={handleSendCode} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={s.btnInner}>
                    <Text style={s.btnText}>Gauti kodą</Text>
                    <ArrowRight size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={s.cardTitle}>Įveskite kodą</Text>
              <Text style={s.cardSub}>Kodas išsiųstas į {email}</Text>
              {devCode !== "" && (
                <View style={s.devBox}>
                  <Text style={s.devLbl}>Kūrimo režimas — jūsų kodas:</Text>
                  <Text style={s.devCode}>{devCode}</Text>
                </View>
              )}
              <View style={s.inputWrap}>
                <KeyRound size={16} color={colors.slate400} style={s.inputIcon} />
                <TextInput
                  style={[s.input, s.codeInput]}
                  placeholder="000000"
                  placeholderTextColor={colors.slate400}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={code}
                  onChangeText={setCode}
                  autoFocus
                />
              </View>
              <TouchableOpacity style={s.btn} onPress={handleVerify} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={s.btnInner}>
                    <Text style={s.btnText}>Prisijungti</Text>
                    <ArrowRight size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={s.backLink} onPress={() => { setStep("email"); setCode(""); }}>
                <RefreshCw size={14} color={colors.slate400} />
                <Text style={s.backText}> Keisti el. paštą</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={s.footer}>
            Neturite paskyros? <Text style={s.footerLink}>Registruotis</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  logoWrap: { alignItems: "center", paddingTop: 64, paddingBottom: 40 },
  logo: { width: 80, height: 80 },
  brand: { marginTop: 16, fontSize: 24, fontWeight: "700", color: colors.navy },
  brandGreen: { color: colors.green },
  tagline: { marginTop: 4, fontSize: 14, color: colors.slate500 },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.navy },
  cardSub: { fontSize: 14, color: colors.slate500, marginTop: 4, marginBottom: 20 },
  inputWrap: { position: "relative", marginBottom: 16 },
  inputIcon: { position: "absolute", left: 14, top: 16, zIndex: 1 },
  input: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingLeft: 40,
    paddingRight: 16,
    fontSize: 14,
    color: colors.navy,
  },
  codeInput: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 8,
    paddingLeft: 16,
  },
  devBox: {
    backgroundColor: colors.amber50,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  devLbl: { fontSize: 12, color: colors.amber700 },
  devCode: { fontSize: 30, fontWeight: "800", letterSpacing: 6, color: colors.amber900, marginTop: 4 },
  btn: {
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  btnText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  backLink: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  backText: { fontSize: 12, color: colors.slate400 },
  footer: { marginTop: 24, textAlign: "center", fontSize: 12, color: colors.slate400 },
  footerLink: { fontWeight: "600", color: colors.green },
});
