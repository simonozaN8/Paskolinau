import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput, Alert,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Bell, Building2, ChevronRight, FileText, LogOut, Mail, MessageCircle,
  Pencil, Phone, Shield, User, Check, X,
} from "lucide-react-native";
import { MobileAppBar } from "../../components/MobileAppBar";
import { useAuth } from "../../lib/AuthContext";
import { updateProfile } from "../../lib/api";
import { colors, radius } from "../../lib/theme";

type FieldKey = "firstName" | "lastName" | "phone" | "bankAccount";

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [bankAccount, setBankAccount] = useState(user?.bankAccount ?? "");
  const [editing, setEditing] = useState<FieldKey | null>(null);
  const [editVal, setEditVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fields: { key: FieldKey; label: string; value: string; Icon: typeof Phone; hint?: string }[] = [
    { key: "phone", label: "Telefono numeris", value: phone || "Nepridėta", Icon: Phone },
    { key: "firstName", label: "Vardas", value: firstName || "—", Icon: User },
    { key: "lastName", label: "Pavardė", value: lastName || "—", Icon: User },
    {
      key: "bankAccount",
      label: "Banko sąskaita (IBAN)",
      value: bankAccount || "Nepridėta",
      Icon: Building2,
      hint: "Šis IBAN bus rodomas gavėjui, kai siųsite prašymą.",
    },
  ];

  const setters: Record<FieldKey, (v: string) => void> = {
    firstName: setFirstName,
    lastName: setLastName,
    phone: setPhone,
    bankAccount: setBankAccount,
  };

  function openEdit(key: FieldKey) {
    const vals = { firstName, lastName, phone, bankAccount };
    setEditVal(vals[key] === "Nepridėta" || vals[key] === "—" ? "" : vals[key]);
    setEditing(key);
  }

  async function saveField() {
    if (!editing) return;
    setters[editing](editVal);
    setEditing(null);
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      await updateProfile({ firstName, lastName, phone, bankAccount });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: unknown) {
      Alert.alert("Klaida", e instanceof Error ? e.message : "Nepavyko išsaugoti");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    Alert.alert("Atsijungti", "Ar tikrai norite atsijungti?", [
      { text: "Atšaukti", style: "cancel" },
      {
        text: "Atsijungti",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  if (!user) {
    return (
      <View style={s.screen}>
        <MobileAppBar variant="logo" />
        <View style={s.guest}>
          <User size={40} color={colors.slate400} />
          <Text style={s.guestTitle}>Nesate prisijungę</Text>
          <TouchableOpacity style={s.guestBtn} onPress={() => router.replace("/(auth)/login")}>
            <Text style={s.guestBtnText}>Prisijungti</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const editingField = fields.find((f) => f.key === editing);

  return (
    <View style={s.screen}>
      <View style={s.headerWhite}>
        <MobileAppBar variant="logo" />
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.avatarBlock}>
          <View style={s.avatarWrap}>
            <User size={40} color={colors.slate400} />
            <TouchableOpacity style={s.editBadge} onPress={() => openEdit("firstName")}>
              <Pencil size={12} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={s.name}>{firstName || "—"} {lastName}</Text>
          <Text style={s.email}>{user.email}</Text>
        </View>

        <Text style={s.sectionLbl}>Paskyros nustatymai</Text>
        <View style={s.card}>
          {fields.map((f, i) => (
            <TouchableOpacity
              key={f.key}
              style={[s.row, i < fields.length - 1 && s.rowBorder]}
              onPress={() => openEdit(f.key)}
              activeOpacity={0.7}
            >
              <View style={s.iconCircle}>
                <f.Icon size={20} color={colors.green} />
              </View>
              <View style={s.rowBody}>
                <Text style={s.rowLabel}>{f.label}</Text>
                <Text style={s.rowVal} numberOfLines={1}>{f.value}</Text>
              </View>
              <Pencil size={16} color={colors.slate300} />
            </TouchableOpacity>
          ))}
          <View style={[s.row, s.rowBorder]}>
            <View style={s.iconCircle}>
              <Mail size={20} color={colors.green} />
            </View>
            <View style={s.rowBody}>
              <Text style={s.rowLabel}>El. paštas</Text>
              <Text style={s.rowVal}>{user.email}</Text>
            </View>
            <View style={s.verifiedBadge}>
              <Text style={s.verifiedText}>
                {user.emailVerified ? "Patvirtintas" : "Nepatvirtintas"}
              </Text>
            </View>
          </View>
        </View>

        <Text style={s.sectionLbl}>Pranešimų nustatymai</Text>
        <View style={s.card}>
          {[
            { Icon: MessageCircle, label: "SMS pranešimai", sub: "Gaukite pranešimus į savo telefoną" },
            { Icon: Mail, label: "El. paštas", sub: "Gaukite pranešimus į savo el. paštą" },
            { Icon: Bell, label: "Push pranešimai", sub: "Gaukite pranešimus programėlėje" },
          ].map(({ Icon, label, sub }, i, arr) => (
            <View key={label} style={[s.row, i < arr.length - 1 && s.rowBorder]}>
              <View style={s.iconCircle}>
                <Icon size={20} color={colors.green} />
              </View>
              <View style={s.rowBody}>
                <Text style={s.rowLabel}>{label}</Text>
                <Text style={s.rowSub}>{sub}</Text>
              </View>
              <View style={s.toggleOn} />
            </View>
          ))}
        </View>

        <View style={s.card}>
          <TouchableOpacity style={[s.row, s.rowBorder]} onPress={() => router.push("/contacts")}>
            <View style={[s.iconCircle, { backgroundColor: colors.slate50 }]}>
              <FileText size={20} color={colors.slate400} />
            </View>
            <View style={s.rowBody}>
              <Text style={s.rowLabel}>Mano kontaktai</Text>
              <Text style={s.rowSub}>Valdykite savo kontaktų sąrašą</Text>
            </View>
            <ChevronRight size={16} color={colors.slate300} />
          </TouchableOpacity>
          <TouchableOpacity style={[s.row, s.rowBorder]} onPress={() => {}}>
            <View style={[s.iconCircle, { backgroundColor: colors.slate50 }]}>
              <Shield size={20} color={colors.slate400} />
            </View>
            <View style={s.rowBody}>
              <Text style={s.rowLabel}>Privatumas</Text>
              <Text style={s.rowSub}>Privatumo politika ir duomenų nustatymai</Text>
            </View>
            <ChevronRight size={16} color={colors.slate300} />
          </TouchableOpacity>
          <TouchableOpacity style={s.row} onPress={handleLogout}>
            <View style={[s.iconCircle, { backgroundColor: colors.slate50 }]}>
              <LogOut size={20} color={colors.red500} />
            </View>
            <View style={s.rowBody}>
              <Text style={[s.rowLabel, { color: colors.red500 }]}>Atsijungti</Text>
              <Text style={s.rowSub}>Atsijunkite nuo savo paskyros</Text>
            </View>
            <ChevronRight size={16} color={colors.slate300} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[s.saveBtn, saved && { backgroundColor: colors.green }]}
          onPress={handleSaveAll}
          disabled={saving}
        >
          <Text style={s.saveBtnText}>{saved ? "Išsaugota!" : "Išsaugoti pakeitimus"}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={editing !== null} transparent animationType="slide">
        <TouchableOpacity style={s.modalBg} activeOpacity={1} onPress={() => setEditing(null)} />
        <View style={s.modalSheet}>
          <View style={s.modalHead}>
            <Text style={s.modalTitle}>{editingField?.label}</Text>
            <TouchableOpacity onPress={() => setEditing(null)}>
              <X size={20} color={colors.slate400} />
            </TouchableOpacity>
          </View>
          <TextInput style={s.modalInput} value={editVal} onChangeText={setEditVal} autoFocus />
          {editingField?.hint && <Text style={s.modalHint}>{editingField.hint}</Text>}
          <TouchableOpacity style={s.modalSave} onPress={saveField}>
            <Check size={16} color="#fff" />
            <Text style={s.modalSaveText}>Išsaugoti</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.gray50 },
  headerWhite: { backgroundColor: colors.white },
  scroll: { paddingBottom: 32 },
  avatarBlock: { alignItems: "center", backgroundColor: colors.white, paddingBottom: 24, paddingTop: 8 },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.slate100,
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 18, fontWeight: "700", color: colors.navy, marginTop: 12 },
  email: { fontSize: 12, color: colors.slate500, marginTop: 2 },
  sectionLbl: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.slate400,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate100,
    overflow: "hidden",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.slate100 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.green50,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: { flex: 1, minWidth: 0 },
  rowLabel: { fontSize: 14, fontWeight: "600", color: colors.navy },
  rowVal: { fontSize: 12, color: colors.slate500, marginTop: 2 },
  rowSub: { fontSize: 12, color: colors.slate400, marginTop: 2 },
  verifiedBadge: { backgroundColor: colors.emerald50, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  verifiedText: { fontSize: 10, fontWeight: "600", color: colors.emerald700 },
  toggleOn: { width: 48, height: 28, borderRadius: 14, backgroundColor: colors.green },
  saveBtn: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: colors.navy,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  guest: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  guestTitle: { fontSize: 18, fontWeight: "700", color: colors.navy },
  guestBtn: { backgroundColor: colors.navy, borderRadius: radius.lg, paddingHorizontal: 24, paddingVertical: 14 },
  guestBtnText: { color: "#fff", fontWeight: "600" },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  modalSheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: "700", color: colors.navy },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.navy,
  },
  modalHint: { fontSize: 11, color: colors.slate400, marginTop: 8 },
  modalSave: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginTop: 16,
  },
  modalSaveText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
