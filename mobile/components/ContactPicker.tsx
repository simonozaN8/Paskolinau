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
} from "react-native";
import { ChevronDown, Plus, Search, Smartphone } from "lucide-react-native";
import { RecipientRow } from "./RecipientRow";
import { PhoneContactPickerModal, type PickedContact } from "./PhoneContactPickerModal";
import { getContacts } from "../lib/api";
import { filterDeviceContacts, loadDeviceContacts } from "../lib/device-contacts";
import type { RecipientEntry, SavedContact } from "../lib/request-types";
import { newEntry } from "../lib/request-helpers";
import { colors, radius } from "../lib/theme";

type Tab = "phone" | "saved";

type Props = {
  entries: RecipientEntry[];
  multiple?: boolean;
  showAmount?: boolean;
  showPaid?: boolean;
  amountLabel?: string;
  onChange: (entries: RecipientEntry[]) => void;
};

function entryFromPicked(c: PickedContact): RecipientEntry {
  return newEntry({
    name: c.name,
    phone: c.phone,
    email: c.email,
  });
}

export function ContactPicker({
  entries,
  multiple = false,
  showAmount,
  showPaid,
  amountLabel,
  onChange,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("phone");
  const [search, setSearch] = useState("");
  const [savedContacts, setSavedContacts] = useState<SavedContact[]>([]);
  const [deviceContacts, setDeviceContacts] = useState<Awaited<ReturnType<typeof loadDeviceContacts>>>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [loadingDevice, setLoadingDevice] = useState(false);

  const loadSaved = useCallback(() => {
    setLoadingSaved(true);
    getContacts()
      .then(setSavedContacts)
      .catch(() => setSavedContacts([]))
      .finally(() => setLoadingSaved(false));
  }, []);

  const loadDevice = useCallback(() => {
    setLoadingDevice(true);
    loadDeviceContacts()
      .then(setDeviceContacts)
      .catch(() => setDeviceContacts([]))
      .finally(() => setLoadingDevice(false));
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    loadSaved();
    loadDevice();
    setTab("phone");
    setSearch("");
  }, [modalOpen, loadSaved, loadDevice]);

  function addEntry(entry: RecipientEntry) {
    setModalOpen(false);
    setSearch("");
    onChange([...entries, entry]);
  }

  function updateEntry(idx: number, updated: RecipientEntry) {
    const next = [...entries];
    next[idx] = updated;
    onChange(next);
  }

  function removeEntry(idx: number) {
    onChange(entries.filter((_, i) => i !== idx));
  }

  const canAddMore = multiple || entries.length === 0;

  const filteredSaved = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return savedContacts;
    return savedContacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.phone ?? "").includes(search.trim()),
    );
  }, [savedContacts, search]);

  const filteredDevice = useMemo(
    () => filterDeviceContacts(deviceContacts, search),
    [deviceContacts, search],
  );

  const listData = tab === "phone" ? filteredDevice : filteredSaved;
  const loading = tab === "phone" ? loadingDevice : loadingSaved;

  return (
    <View>
      {entries.map((entry, i) => (
        <RecipientRow
          key={entry.id}
          entry={entry}
          showAmount={showAmount}
          showPaid={showPaid}
          amountLabel={amountLabel}
          canRemove={entries.length > 1}
          onChange={(u) => updateEntry(i, u)}
          onRemove={() => removeEntry(i)}
        />
      ))}

      {canAddMore && (
        <TouchableOpacity style={s.addBtn} onPress={() => setModalOpen(true)} activeOpacity={0.85}>
          <Plus size={18} color={colors.slate600} />
          <Text style={s.addText}>
            {entries.length === 0 ? "Pridėti gavėją" : "Pridėti dar vieną gavėją"}
          </Text>
          <ChevronDown size={16} color={colors.slate400} />
        </TouchableOpacity>
      )}

      <Modal visible={modalOpen} animationType="slide" transparent onRequestClose={() => setModalOpen(false)}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Pridėti gavėją</Text>

            <View style={s.tabs}>
              <TouchableOpacity
                style={[s.tab, tab === "phone" && s.tabOn]}
                onPress={() => setTab("phone")}
              >
                <Smartphone size={14} color={tab === "phone" ? colors.green : colors.slate500} />
                <Text style={[s.tabText, tab === "phone" && s.tabTextOn]}>Telefonas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.tab, tab === "saved" && s.tabOn]}
                onPress={() => setTab("saved")}
              >
                <Text style={[s.tabText, tab === "saved" && s.tabTextOn]}>Išsaugoti</Text>
              </TouchableOpacity>
            </View>

            <View style={s.searchWrap}>
              <Search size={16} color={colors.slate400} />
              <TextInput
                style={s.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder={
                  tab === "phone" ? "Ieškoti vardo ar numerio..." : "Ieškoti išsaugotų kontaktų..."
                }
                placeholderTextColor={colors.slate300}
                autoCorrect={false}
              />
            </View>

            {loading ? (
              <ActivityIndicator color={colors.green} style={{ marginVertical: 20 }} />
            ) : (
              <FlatList
                data={listData}
                keyExtractor={(item) => item.id}
                style={{ maxHeight: 260 }}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <Text style={s.empty}>
                    {search
                      ? "Kontaktų nerasta"
                      : tab === "phone"
                      ? "Kontaktų nerasta arba neleidote prieigos"
                      : "Dar nėra išsaugotų kontaktų"}
                  </Text>
                }
                renderItem={({ item }) => {
                  if (tab === "phone") {
                    const c = item as (typeof filteredDevice)[0];
                    return (
                      <TouchableOpacity
                        style={s.contactRow}
                        onPress={() => addEntry(entryFromPicked({ name: c.name.split(" · ")[0] ?? c.name, phone: c.phone, email: c.email }))}
                      >
                        <View style={s.contactAvatar}>
                          <Text style={s.contactInitial}>{c.name[0]?.toUpperCase() ?? "?"}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.contactName}>{c.name}</Text>
                          <Text style={s.contactSub}>{c.phone || c.email || "—"}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }
                  const c = item as SavedContact;
                  return (
                    <TouchableOpacity
                      style={s.contactRow}
                      onPress={() =>
                        addEntry(newEntry({ name: c.name, email: c.email ?? "", phone: c.phone ?? "" }))
                      }
                    >
                      <View style={s.contactAvatar}>
                        <Text style={s.contactInitial}>{c.name[0]?.toUpperCase() ?? "?"}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.contactName}>{c.name}</Text>
                        <Text style={s.contactSub}>{c.email ?? c.phone ?? "—"}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            <TouchableOpacity style={s.manualBtn} onPress={() => addEntry(newEntry())}>
              <Plus size={18} color="#fff" />
              <Text style={s.manualBtnText}>Įvesti rankiniu būdu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.cancelBtn} onPress={() => setModalOpen(false)}>
              <Text style={s.cancelText}>Atšaukti</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.slate200,
    borderRadius: radius.md,
    paddingVertical: 14,
    backgroundColor: colors.slate50,
  },
  addText: { fontSize: 14, fontWeight: "500", color: colors.slate600 },
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: "88%",
  },
  sheetTitle: { fontSize: 18, fontWeight: "700", color: colors.navy, marginBottom: 12 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 12 },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate200,
  },
  tabOn: { borderColor: colors.green, backgroundColor: colors.green50 },
  tabText: { fontSize: 13, fontWeight: "600", color: colors.slate500 },
  tabTextOn: { color: colors.green },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: colors.navy },
  empty: { textAlign: "center", fontSize: 12, color: colors.slate400, paddingVertical: 16 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  contactAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  contactInitial: { color: "#fff", fontWeight: "700", fontSize: 14 },
  contactName: { fontSize: 14, fontWeight: "600", color: colors.navy },
  contactSub: { fontSize: 12, color: colors.slate400 },
  manualBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.navy,
    borderRadius: radius.md,
    paddingVertical: 14,
    marginTop: 12,
  },
  manualBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  cancelBtn: { alignItems: "center", paddingTop: 14 },
  cancelText: { fontSize: 14, color: colors.slate500 },
});
