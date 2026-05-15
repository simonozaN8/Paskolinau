import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import ProfilisClient from "./ProfilisClient";

export default async function ProfilisPage() {
  const user = await getSessionUser();
  if (!user) redirect("/prisijungti");

  return (
    <ProfilisClient
      initialUser={{
        id:           user.id,
        firstName:    user.firstName    ?? "",
        lastName:     user.lastName     ?? "",
        email:        user.email,
        emailVerified: user.emailVerified ?? false,
        bankAccount:  user.bankAccount  ?? "",
        phone:        user.phone        ?? "",
      }}
    />
  );
}
