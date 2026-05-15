import { Alert } from "react-native";
import { patchRequestStatus } from "./api";

export async function sendReminder(recipientName: string, requestId: string) {
  const res = await patchRequestStatus(requestId, "remind");
  const parts: string[] = [];
  if (res.channels?.includes("sms")) parts.push("SMS");
  if (res.channels?.includes("email")) parts.push("el. paštas");
  const via = parts.length ? parts.join(" ir ") : "pranešimas";
  let msg = `${recipientName} gavo priminimą (${via}) su oficialia mokėjimo nuoroda.`;
  const warnings = (res as { warnings?: string[] }).warnings;
  if (warnings?.length) {
    msg += `\n\nPastaba: ${warnings.join(" ")}`;
  }
  Alert.alert("Priminimas išsiųstas", msg);
  return res;
}
