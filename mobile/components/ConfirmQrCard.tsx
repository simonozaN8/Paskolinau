import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Link2, QrCode } from "lucide-react-native";
import { buildConfirmUrl } from "../lib/confirm-url";
import { colors, radius } from "../lib/theme";

type Props = {
  confirmToken: string;
  recipientName?: string;
  compact?: boolean;
};

export function ConfirmQrCard({ confirmToken, recipientName, compact }: Props) {
  const confirmUrl = buildConfirmUrl(confirmToken);
  const [shared, setShared] = useState(false);
  const size = compact ? 120 : 152;

  async function shareLink() {
    try {
      await Share.share({
        message: `Paskolinau.lt – patvirtinkite prašymą: ${confirmUrl}`,
        url: confirmUrl,
      });
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      /* user cancelled */
    }
  }

  return (
    <View style={[s.card, compact && s.cardCompact]}>
      <View style={[s.row, compact && s.rowCompact]}>
        <View style={s.qrWrap}>
          <QRCode value={confirmUrl} size={size} color={colors.navy} backgroundColor="#fff" />
        </View>
        <View style={s.textCol}>
          <View style={s.titleRow}>
            <QrCode size={16} color={colors.green} />
            <Text style={s.title}>QR patvirtinimas</Text>
          </View>
          {recipientName ? (
            <Text style={s.recipient}>{recipientName}</Text>
          ) : null}
          <Text style={s.desc}>
            Skolininkas nuskenuoja QR — tai mini parašas, patvirtinantis skolą.
          </Text>
          <TouchableOpacity style={s.linkBtn} onPress={shareLink}>
            <Link2 size={14} color={colors.green} />
            <Text style={s.linkText}>{shared ? "Pasidalinta" : "Dalintis nuoroda"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.slate200,
    backgroundColor: "#fff",
    padding: 14,
    marginTop: 12,
  },
  cardCompact: { padding: 12 },
  row: { flexDirection: "column", gap: 12 },
  rowCompact: { flexDirection: "row", alignItems: "center" },
  qrWrap: {
    alignSelf: "center",
    padding: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.slate100,
    backgroundColor: "#fff",
  },
  textCol: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { fontSize: 14, fontWeight: "700", color: colors.navy },
  recipient: { fontSize: 12, color: colors.slate600, marginTop: 2 },
  desc: { fontSize: 12, color: colors.slate600, lineHeight: 18, marginTop: 6 },
  linkBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  linkText: { fontSize: 12, fontWeight: "600", color: colors.green },
});
