import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialVIP – Exclusive Members' Club Events",
  description:
    "Discover and book exclusive events at SocialVIP, the premium members' club experience.",
  openGraph: {
    title: "SocialVIP",
    description: "Exclusive Members' Club Events",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
