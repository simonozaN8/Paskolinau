import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Search, Smartphone, X } from "lucide-react-native";
import {
  filterDeviceContacts,
  loadDeviceContacts,
  requestContactsPermission,
  type DeviceContact,
} from "../lib/device-contacts";
import { colors, radius } from "../lib/theme";

export type PickedContact = {
  name: string;
  phone: string;
  email: string;
};

type Props = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  onSelect: (contact: PickedContact) => void;
};

export function PhoneContactPickerModal({
  visible,
  title = "Pasirinkti iš telefono",
  onClose,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [denied, setDenied] = useState(false);
  const [deviceContacts, setDeviceContacts] = useState<DeviceContact[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setDenied(false);
    const granted = await requestContactsPermission();
    if (!granted) {
      setDenied(true);
      setDeviceContacts([]);
      setLoading(false);
      return;
    }
    try {
      setDeviceContacts(await loadDeviceContacts(true));
    } catch {
      setDeviceContacts([]);
      Alert.alert("Klaida", "Nepavyko nuskaityti kontaktų.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) {
      setSearch("");
      return;
    }
    load();
  }, [visible, load]);

  const filtered = useMemo(
    () => filterDeviceContacts(deviceContacts, search),
    [deviceContacts, search],
  );

  function pick(c: DeviceContact) {
    onSelect({ name: c.name.split(" · ")[0] ?? c.name, phone: c.phone, email: c.email });
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.header}>
            <Text style={s.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <X size={22} color={colors.slate500} />
            </TouchableOpacity>
          </View>

          <View style={s.searchWrap}>
            <Search size={16} color={colors.slate400} />
            <TextInput
              style={s.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Ieškoti vardo ar numerio..."
              placeholderTextColor={colors.slate300}
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          {loading ? (
            <ActivityIndicator color={colors.green} style={{ marginVertical: 28 }} />
          ) : denied ? (
            <View style={s.emptyBox}>
              <Smartphone size={32} color={colors.slate300} />
              <Text style={s.emptyTitle}>Nėra prieigos prie kontaktų</Text>
              <Text style={s.emptySub}>
                Leiskite prieigą telefono nustatymuose arba įveskite numerį rankiniu būdu.
              </Text>
              <TouchableOpacity style={s.retryBtn} onPress={load}>
                <Text style={s.retryText}>Bandyti dar kartą</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              style={s.list}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={24}
              maxToRenderPerBatch={32}
              windowSize={8}
              ListEmptyComponent={
                <Text style={s.emptyList}>
                  {search ? "Kontaktų nerasta" : "Kontaktų sąrašas tuščias"}
                </Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity style={s.row} onPress={() => pick(item)} activeOpacity={0.7}>
                  <View style={s.avatar}>
                    <Text style={s.initial}>{item.name[0]?.toUpperCase() ?? "?"}</Text>
                  </View>
                  <View style={s.rowBody}>
                    <Text style={s.rowName} numberOfLines={1}>{item.name}</Text>
                    <Text style={s.rowPhone} numberOfLines={1}>{item.phone || item.email}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.45)" },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "700", color: colors.navy, flex: 1 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: { flex: 1, paddingVertical: 11, fontSize: 15, color: colors.navy },
  list: { maxHeight: 360 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { color: "#fff", fontWeight: "700", fontSize: 15 },
  rowBody: { flex: 1, minWidth: 0 },
  rowName: { fontSize: 15, fontWeight: "600", color: colors.navy },
  rowPhone: { fontSize: 13, color: colors.slate500, marginTop: 2 },
  emptyList: { textAlign: "center", fontSize: 13, color: colors.slate400, paddingVertical: 24 },
  emptyBox: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 12 },
  emptyTitle: { fontSize: 15, fontWeight: "600", color: colors.navy, marginTop: 12 },
  emptySub: { fontSize: 13, color: colors.slate500, textAlign: "center", marginTop: 6, lineHeight: 20 },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.navy,
  },
  retryText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
