import * as Contacts from "expo-contacts";

export type DeviceContact = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

let cached: DeviceContact[] | null = null;

export async function requestContactsPermission(): Promise<boolean> {
  const { status } = await Contacts.requestPermissionsAsync();
  return status === "granted";
}

function displayName(c: Contacts.Contact): string {
  if (c.name?.trim()) return c.name.trim();
  const parts = [c.firstName, c.lastName].filter(Boolean);
  return parts.length ? parts.join(" ") : "Be vardo";
}

export async function loadDeviceContacts(force = false): Promise<DeviceContact[]> {
  if (cached && !force) return cached;

  const granted = await requestContactsPermission();
  if (!granted) return [];

  const { data } = await Contacts.getContactsAsync({
    fields: [
      Contacts.Fields.PhoneNumbers,
      Contacts.Fields.Emails,
      Contacts.Fields.Name,
      Contacts.Fields.FirstName,
      Contacts.Fields.LastName,
    ],
    sort: Contacts.SortTypes.FirstName,
  });

  const rows: DeviceContact[] = [];

  for (const c of data) {
    const name = displayName(c);
    const phones = c.phoneNumbers ?? [];
    const email = c.emails?.[0]?.email ?? "";

    if (!phones.length) {
      if (email) rows.push({ id: c.id ?? String(rows.length), name, phone: "", email });
      continue;
    }

    phones.forEach((p, i) => {
      const phone = (p.number ?? "").trim();
      if (!phone) return;
      const label =
        phones.length > 1 && p.label ? `${name} · ${p.label}` : name;
      rows.push({
        id: `${c.id ?? "c"}-${i}`,
        name: label,
        phone,
        email,
      });
    });
  }

  cached = rows;
  return rows;
}

export function filterDeviceContacts(list: DeviceContact[], query: string): DeviceContact[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  const qDigits = q.replace(/\D/g, "");
  return list.filter((c) => {
    if (c.name.toLowerCase().includes(q)) return true;
    if (c.email.toLowerCase().includes(q)) return true;
    if (qDigits && c.phone.replace(/\D/g, "").includes(qDigits)) return true;
    return c.phone.toLowerCase().includes(q);
  });
}

export function clearDeviceContactsCache() {
  cached = null;
}
