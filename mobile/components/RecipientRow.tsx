import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { BookUser, User, X } from "lucide-react-native";
import { PhoneContactPickerModal } from "./PhoneContactPickerModal";
import type { RecipientEntry } from "../lib/request-types";
import { colors, radius } from "../lib/theme";

type Props = {
  entry: RecipientEntry;
  showAmount?: boolean;
  showPaid?: boolean;
  amountLabel?: string;
  canRemove: boolean;
  onChange: (updated: RecipientEntry) => void;
  onRemove: () => void;
};

export function RecipientRow({
  entry,
  showAmount,
  showPaid,
  amountLabel,
  canRemove,
  onChange,
  onRemove,
}: Props) {
  const [phoneBookOpen, setPhoneBookOpen] = useState(false);

  return (
    <View style={s.card}>
      <View style={s.head}>
        <View style={s.avatar}>
          <User size={14} color={colors.slate500} />
        </View>
        <Text style={s.name} numberOfLines={1}>
          {entry.name || "Naujas gavėjas"}
        </Text>
        {canRemove && (
          <TouchableOpacity onPress={onRemove} hitSlop={8}>
            <X size={18} color={colors.slate400} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={s.lbl}>Vardas *</Text>
      <TextInput
        style={s.input}
        value={entry.name}
        onChangeText={(name) => onChange({ ...entry, name })}
        placeholder="Jonas Jonaitis"
        placeholderTextColor={colors.slate300}
      />

      {showAmount && (
        <>
          <Text style={s.lbl}>{amountLabel ?? "Suma (€)"} *</Text>
          <TextInput
            style={s.input}
            value={entry.amount ? String(entry.amount) : ""}
            onChangeText={(v) => onChange({ ...entry, amount: parseFloat(v) || 0 })}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.slate300}
          />
        </>
      )}

      {showPaid && (
        <>
          <Text style={s.lbl}>Sumokėjo (€)</Text>
          <TextInput
            style={s.input}
            value={entry.paidAmount ? String(entry.paidAmount) : ""}
            onChangeText={(v) => onChange({ ...entry, paidAmount: parseFloat(v) || 0 })}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.slate300}
          />
        </>
      )}

      <Text style={s.contactHint}>Bent vienas kontaktas privalomas – galite įvesti ir telefoną, ir el. paštą</Text>

      <Text style={s.lbl}>El. paštas</Text>
      <TextInput
        style={s.input}
        value={entry.email}
        onChangeText={(email) => onChange({ ...entry, email })}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="jonas@pastas.lt"
        placeholderTextColor={colors.slate300}
      />

      <Text style={s.lbl}>Telefonas</Text>
      <View style={s.phoneRow}>
        <TextInput
          style={[s.input, s.phoneInput]}
          value={entry.phone}
          onChangeText={(phone) => onChange({ ...entry, phone })}
          keyboardType="phone-pad"
          placeholder="+370 600 00 000"
          placeholderTextColor={colors.slate300}
        />
        <TouchableOpacity
          style={s.phoneBookBtn}
          onPress={() => setPhoneBookOpen(true)}
          activeOpacity={0.85}
          accessibilityLabel="Pasirinkti iš telefono kontaktų"
        >
          <BookUser size={18} color={colors.navy} />
        </TouchableOpacity>
      </View>

      <PhoneContactPickerModal
        visible={phoneBookOpen}
        title="Kontaktai iš telefono"
        onClose={() => setPhoneBookOpen(false)}
        onSelect={(c) =>
          onChange({
            ...entry,
            name: entry.name.trim() ? entry.name : c.name,
            phone: c.phone,
            email: entry.email.trim() ? entry.email : c.email,
          })
        }
      />

      <TouchableOpacity
        style={s.checkRow}
        onPress={() => onChange({ ...entry, saveAsContact: !entry.saveAsContact })}
        activeOpacity={0.8}
      >
        <View style={[s.checkbox, entry.saveAsContact && s.checkboxOn]}>
          {entry.saveAsContact && <Text style={s.checkMark}>✓</Text>}
        </View>
        <Text style={s.checkLbl}>Išsaugoti į mano kontaktus</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
    padding: 14,
    marginBottom: 10,
  },
  head: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.slate100,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.navy },
  contactHint: { fontSize: 11, color: colors.slate500, marginTop: 4, marginBottom: 4, lineHeight: 16 },
  lbl: { fontSize: 12, fontWeight: "500", color: colors.slate600, marginBottom: 4, marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.navy,
  },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  phoneInput: { flex: 1 },
  phoneBookBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: colors.slate50,
    alignItems: "center",
    justifyContent: "center",
  },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.slate300,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.green, borderColor: colors.green },
  checkMark: { color: "#fff", fontSize: 11, fontWeight: "700" },
  checkLbl: { fontSize: 12, color: colors.slate500 },
});
