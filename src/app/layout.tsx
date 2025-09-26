// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Footer from "../components/Footer"; // Import Footer

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Jotz - Catatan & Berkas Ephemeral",
  description:
    "Bagikan catatan dan berkas yang otomatis terhapus dalam 24 jam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
