import { Redirect } from "expo-router";
import { useAuth } from "../lib/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { colors } from "../lib/theme";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.navy }}>
        <ActivityIndicator color={colors.green} size="large" />
      </View>
    );
  }

  return <Redirect href={user ? "/(tabs)" : "/(auth)/login"} />;
}
