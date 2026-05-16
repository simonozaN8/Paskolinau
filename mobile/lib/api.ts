import * as SecureStore from "expo-secure-store";
import type { RequestShare } from "./confirm-url";

// Change this to your computer's local IP when testing on a physical device
// e.g. "http://192.168.1.100:3000"
export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export type ApiUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bankAccount: string;
  emailVerified: boolean;
};

const TOKEN_KEY = "paskolinau_token";
const USER_KEY  = "paskolinau_user";

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getStoredUser(): Promise<ApiUser | null> {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as ApiUser; } catch { return null; }
}

export async function storeSession(token: string, user: ApiUser) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getStoredToken();
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = await authHeaders();
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...headers, ...(options?.headers as Record<string, string> | undefined) },
    });
  } catch {
    const hint =
      API_BASE.includes("localhost") || API_BASE.includes("127.0.0.1")
        ? " Telefone „localhost“ neveikia — mobile/.env nustatykite EXPO_PUBLIC_API_URL su kompiuterio IP (ipconfig)."
        : ` Serveris: ${API_BASE}. Patikrinkite: npm run dev veikia, tas pats WiFi, firewall.`;
    throw new Error(`Nepavyko prisijungti prie serverio.${hint}`);
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Klaida" })) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// Auth
export async function sendCode(email: string) {
  return apiFetch<{ ok: boolean; dev?: string }>("/api/auth/send-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function mobileLogin(email: string, code: string) {
  return apiFetch<{ token: string; user: ApiUser }>("/api/auth/mobile-login", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function registerUser(data: {
  firstName: string; lastName: string; phone: string; email: string; bankAccount: string;
}) {
  return apiFetch<{ id: string }>("/api/registrations", { method: "POST", body: JSON.stringify(data) });
}

export async function getMe() {
  return apiFetch<ApiUser>("/api/auth/me");
}

export async function updateProfile(data: Partial<Pick<ApiUser, "firstName" | "lastName" | "phone" | "bankAccount">>) {
  return apiFetch<ApiUser>("/api/profile", { method: "PATCH", body: JSON.stringify(data) });
}

export async function getRequests() {
  return apiFetch<import("./types").DashRequest[]>("/api/requests");
}

export async function getRequest(id: string) {
  return apiFetch<import("./types").DashRequest>(`/api/requests/${id}`);
}

export async function patchRequestStatus(
  id: string,
  action: "complete" | "cancel" | "remind",
) {
  return apiFetch<{ ok: boolean; channels?: string[]; request?: import("./types").DashRequest }>(
    `/api/requests/${id}/status`,
    { method: "PATCH", body: JSON.stringify({ action }) },
  );
}

export async function updateRequest(
  id: string,
  data: {
    recipientName?: string;
    recipientEmail?: string | null;
    recipientPhone?: string | null;
    amount?: number;
    description?: string;
    itemDescription?: string | null;
    dueDate?: string;
  },
) {
  return apiFetch<import("./types").DashRequest>(`/api/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteRequest(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/requests/${id}`, { method: "DELETE" });
}

export type CreateRequestPayload = {
  scenario: string;
  recipients: {
    name: string;
    email: string | null;
    phone: string | null;
    amount: number;
    saveAsContact: boolean;
  }[];
  dueDate: string;
  description: string;
  itemDescription?: string | null;
  reminderType: string;
  reminderDays: number;
  attachments: { name: string; size: number; type: string; data: string }[];
  consent: boolean;
};

export async function createRequest(payload: CreateRequestPayload) {
  return apiFetch<{ ids: string[]; shares: RequestShare[]; count: number; totalAmount: number }>("/api/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type SavedContact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

export async function getContacts() {
  return apiFetch<SavedContact[]>("/api/contacts");
}
