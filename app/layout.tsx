import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StartRegistrationProvider } from "@/components/registration/StartRegistrationProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { getSessionUser } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paskolinau.lt – Sukurk. Išsiųsk. Sistema pasirūpins.",
  description:
    "Paprasta ir patikima sistema mokėjimo prašymams, priminimams ir skolų valdymui.",
  icons: {
    icon: [{ url: "/Paskolinau_varpelis_logo.png", type: "image/png" }],
    apple: "/Paskolinau_varpelis_logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read session server-side so the initial auth state is embedded in HTML.
  // This bypasses any client-side fetch() issues on mobile/PWA.
  const sessionUser = await getSessionUser();
  const initialUser = sessionUser
    ? {
        id: sessionUser.id,
        firstName: sessionUser.firstName ?? "",
        lastName: sessionUser.lastName ?? "",
        email: sessionUser.email,
        emailVerified: sessionUser.emailVerified ?? false,
        bankAccount: sessionUser.bankAccount ?? "",
        phone: sessionUser.phone ?? "",
      }
    : null;

  return (
    <html
      lang="lt"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <AuthProvider initialUser={initialUser}>
          <StartRegistrationProvider>
            {children}
          </StartRegistrationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
